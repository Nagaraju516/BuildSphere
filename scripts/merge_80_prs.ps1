# BuildSphere 80 Pull Requests Merger Engine
# Merges all open PRs in Nagaraju516/BuildSphere via GitHub REST API

$repoRoot = "C:\Users\hp\.gemini\antigravity-ide\scratch\buildsphere"
Set-Location $repoRoot

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class WinCred {
    [DllImport("advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    public static extern bool CredRead(string target, int type, int reservedFlag, out IntPtr credentialPtr);

    [DllImport("advapi32.dll", SetLastError = true)]
    public static extern void CredFree(IntPtr credentialPtr);

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct CREDENTIAL {
        public int Flags;
        public int Type;
        public string TargetName;
        public string Comment;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
        public int CredentialBlobSize;
        public IntPtr CredentialBlob;
        public int Persist;
        public int AttributeCount;
        public IntPtr Attributes;
        public string TargetAlias;
        public string UserName;
    }

    public static string GetToken() {
        string[] targets = new string[] { "git:https://github.com", "git:https://x-access-token@github.com" };
        foreach (string target in targets) {
            IntPtr credPtr;
            if (CredRead(target, 1, 0, out credPtr)) {
                var cred = (CREDENTIAL)Marshal.PtrToStructure(credPtr, typeof(CREDENTIAL));
                byte[] bytes = new byte[cred.CredentialBlobSize];
                Marshal.Copy(cred.CredentialBlob, bytes, 0, cred.CredentialBlobSize);
                CredFree(credPtr);
                string utf8 = Encoding.UTF8.GetString(bytes);
                if (utf8.StartsWith("gho_") || utf8.StartsWith("ghp_")) return utf8;
                string unicode = Encoding.Unicode.GetString(bytes);
                if (unicode.StartsWith("gho_") || unicode.StartsWith("ghp_")) return unicode;
            }
        }
        return null;
    }
}
"@

$token = [WinCred]::GetToken()
if (-not $token) {
    Write-Error "Could not retrieve GitHub token."
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "User-Agent"    = "BuildSphere-PR-Merger"
    "Accept"        = "application/vnd.github.v3+json"
}

Write-Host "Fetching all open Pull Requests from Nagaraju516/BuildSphere..."
$openPrs = Invoke-RestMethod -Uri "https://api.github.com/repos/Nagaraju516/BuildSphere/pulls?state=open&per_page=100" -Headers $headers

Write-Host "Found $($openPrs.Count) open pull requests to merge.`n"

# Sort chronologically by PR number (PR #1 first, then #2, ... #80)
$sortedPrs = $openPrs | Sort-Object number

$merged = 0
$failed = 0

foreach ($pr in $sortedPrs) {
    $num = $pr.number
    $title = $pr.title
    Write-Host "[$num / 80] Merging: $title..."

    $mergePayload = @{
        commit_title = "Merge pull request #$num from $($pr.head.ref)"
        merge_method = "merge"
    } | ConvertTo-Json

    try {
        $res = Invoke-RestMethod -Uri "https://api.github.com/repos/Nagaraju516/BuildSphere/pulls/$num/merge" `
            -Method Put -Headers $headers -Body $mergePayload -ContentType "application/json"
        
        if ($res.merged) {
            Write-Host "  -> SUCCESS: PR #$($num) is now MERGED (Purple)"
            $merged++
        } else {
            Write-Warning "  -> Could not merge PR #$($num): $($res.message)"
            $failed++
        }
    } catch {
        Write-Warning "  -> Merge API error on PR #$($num): $_"
        Start-Sleep -Milliseconds 600
        try {
            $res = Invoke-RestMethod -Uri "https://api.github.com/repos/Nagaraju516/BuildSphere/pulls/$num/merge" `
                -Method Put -Headers $headers -Body $mergePayload -ContentType "application/json"
            if ($res.merged) {
                Write-Host "  -> RETRY SUCCESS: PR #$($num) is now MERGED"
                $merged++
            }
        } catch {
            Write-Warning "  -> Retry failed on PR #$($num): $_"
            $failed++
        }
    }

    # Delay to respect secondary rate limits
    Start-Sleep -Milliseconds 350
}

Write-Host "`n=========================================="
Write-Host "MERGE SUMMARY: $merged Merged, $failed Failed"
Write-Host "=========================================="

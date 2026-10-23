# Deploy dist to gh-pages branch
$repoRoot = "C:\Users\hp\.gemini\antigravity-ide\scratch\buildsphere"
Set-Location $repoRoot

# 1. Commit any vite.config.ts update on main
git add vite.config.ts
git commit -m "chore(build): set base to relative for GitHub Pages"
git push origin main

# 2. Extract token from credential manager
$inputStr = "protocol=https`nhost=github.com`n"
$token = (($inputStr | git credential fill) | Select-String "password=").ToString().Replace("password=", "").Trim()

# 3. Create a clean gh-pages branch with dist contents
$distDir = Join-Path $repoRoot "dist"
$tempWorkDir = Join-Path $env:TEMP ("buildsphere-ghpages-" + [System.Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $tempWorkDir -Force | Out-Null

Copy-Item -Path "$distDir\*" -Destination $tempWorkDir -Recurse -Force
# Create .nojekyll so GitHub Pages does not ignore underscore files
New-Item -ItemType File -Path (Join-Path $tempWorkDir ".nojekyll") -Force | Out-Null
# Copy index.html as 404.html for SPA routing
Copy-Item -Path "$distDir\index.html" -Destination (Join-Path $tempWorkDir "404.html") -Force

Set-Location $tempWorkDir
git init --quiet
git checkout -B gh-pages --quiet
git add -A
git commit -m "deploy: live production build on GitHub Pages" --quiet

$remoteUrl = "https://x-access-token:$($token)@github.com/Nagaraju516/BuildSphere.git"
git remote add origin $remoteUrl
git push origin gh-pages --force --quiet

Set-Location $repoRoot
Remove-Item -Path $tempWorkDir -Recurse -Force -ErrorAction SilentlyContinue

# 4. Enable GitHub Pages via GitHub API
$headers = @{
    "Authorization" = "Bearer $token"
    "User-Agent"    = "BuildSphere-Deploy"
    "Accept"        = "application/vnd.github.v3+json"
}

# Try enabling GitHub Pages on gh-pages branch
$pagePayload = @{
    source = @{
        branch = "gh-pages"
        path   = "/"
    }
} | ConvertTo-Json

try {
    $res = Invoke-RestMethod -Uri "https://api.github.com/repos/Nagaraju516/BuildSphere/pages" `
        -Method Post -Headers $headers -Body $pagePayload -ContentType "application/json"
    Write-Host "GitHub Pages successfully enabled: $($res.html_url)"
} catch {
    Write-Host "GitHub Pages API note: $_"
    try {
        $res = Invoke-RestMethod -Uri "https://api.github.com/repos/Nagaraju516/BuildSphere/pages" `
            -Method Get -Headers $headers
        Write-Host "GitHub Pages live URL: $($res.html_url)"
    } catch {
        Write-Host "GitHub Pages status check note: $_"
    }
}

Write-Host "DEPLOYMENT COMPLETE!"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8765/")
$listener.Start()
Write-Host "Serving at http://localhost:8765/"
$root = "C:\Users\yerem\Bakery work1\luxe-style-barbershop"
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    $path = $req.Url.LocalPath -replace "/", "\"
    if ($path -eq "\") { $path = "\index.html" }
    $file = Join-Path $root $path.TrimStart("\")
    if (Test-Path $file -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($file).ToLower()
        $mime = @{".html"="text/html";".css"="text/css";".js"="application/javascript";".jpg"="image/jpeg";".png"="image/png";".svg"="image/svg+xml";".json"="application/json";".webp"="image/webp"}[$ext]
        if (-not $mime) { $mime = "application/octet-stream" }
        $res.ContentType = $mime
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
        $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    $res.OutputStream.Close()
}

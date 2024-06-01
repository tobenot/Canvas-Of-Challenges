# 设置端口
$Port = 8000

# 设置当前目录路径
$Directory = Get-Location

# 确认执行策略允许脚本执行
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

Write-Host "Starting HTTP server in $Directory on port $Port"

# 启动Python的HTTP服务器
Start-Process "powershell" -ArgumentList "python -m http.server $Port"
Start-Sleep -Seconds 2 # 等待服务器启动

# 打开默认浏览器并跳转到本地服务器网址
Start-Process "http://localhost:$Port"
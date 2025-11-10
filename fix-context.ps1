$lines = Get-Content "workers\util\context.ts"
$lines[74] = "		case 'cookie': {"
$lines[85] = "			break;
		}"
$lines | Set-Content "workers\util\context.ts"
Write-Output "Manually fixed case block"

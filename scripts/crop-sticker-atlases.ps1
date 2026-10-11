$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$sourceDir = Join-Path $root 'public/assets/stickers'
$targetDir = Join-Path $root 'public/assets/sticker-cells'
New-Item -ItemType Directory -Path $targetDir -Force | Out-Null

# Must match the source rectangles in src/components/editorial/StickerArt.tsx.
$regions = @{
  journey = @(@(0,145,458,475),@(465,117,374,541),@(847,137,402,518),@(0,685,445,468),@(449,775,383,380),@(833,713,418,442))
  italy = @(@(0,85,449,545),@(450,211,379,410),@(830,95,424,525),@(0,673,501,519),@(502,624,279,566),@(812,640,442,552))
  japan = @(@(87,260,303,350),@(520,270,247,340),@(918,270,220,337),@(90,698,279,340),@(488,755,297,285),@(886,747,277,280))
  landscape = @(@(86,246,312,348),@(501,291,276,294),@(894,231,255,375),@(85,684,333,369),@(503,710,280,329),@(889,701,285,353))
  terrain = @(@(0,242,445,375),@(446,244,411,375),@(858,150,396,480),@(0,677,440,474),@(441,691,412,461),@(854,710,400,445))
  coast = @(@(39,188,451,448),@(491,108,337,530),@(831,257,398,378),@(36,702,474,484),@(511,722,307,465),@(896,674,331,506))
  train = @(@(80,240,333,359),@(481,274,319,326),@(941,228,171,381),@(86,733,362,362),@(470,784,337,317),@(926,732,223,386))
}

foreach ($atlas in $regions.Keys) {
  $source = [System.Drawing.Bitmap]::new((Join-Path $sourceDir "$atlas-v2.png"))
  try {
    for ($cell = 0; $cell -lt $regions[$atlas].Count; $cell++) {
      $box = $regions[$atlas][$cell]
      $rect = [System.Drawing.Rectangle]::new($box[0],$box[1],$box[2],$box[3])
      $piece = $source.Clone($rect,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
      try { $piece.Save((Join-Path $targetDir "$atlas-$cell.png"),[System.Drawing.Imaging.ImageFormat]::Png) }
      finally { $piece.Dispose() }
    }
  }
  finally { $source.Dispose() }
}

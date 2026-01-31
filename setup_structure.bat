@echo off
if not exist components mkdir components
if not exist lib mkdir lib
if not exist models mkdir models
if not exist app\login mkdir app\login
if not exist app\register mkdir app\register
if not exist app\dashboard mkdir app\dashboard
if not exist app\sources mkdir app\sources
if not exist app\admin\sources mkdir app\admin\sources
if not exist app\reports mkdir app\reports
if not exist app\settings mkdir app\settings
if not exist app\alerts mkdir app\alerts
if not exist app\api\auth\login mkdir app\api\auth\login
if not exist app\api\auth\register mkdir app\api\auth\register
if not exist app\api\energy-sources mkdir app\api\energy-sources
if not exist app\api\alerts mkdir app\api\alerts
if not exist app\api\stats mkdir app\api\stats

type nul > components\Navbar.tsx
type nul > components\Footer.tsx
type nul > lib\db.ts
type nul > models\User.ts
type nul > models\EnergySource.ts
type nul > models\DailySummary.ts
type nul > models\Alert.ts
type nul > models\EnergyReading.ts
type nul > app\login\page.tsx
type nul > app\register\page.tsx
type nul > app\dashboard\page.tsx
type nul > app\sources\page.tsx
type nul > app\admin\sources\page.tsx
type nul > app\reports\page.tsx
type nul > app\settings\page.tsx
type nul > app\alerts\page.tsx
type nul > app\api\auth\login\route.ts
type nul > app\api\auth\register\route.ts
type nul > app\api\energy-sources\route.ts
type nul > app\api\alerts\route.ts
type nul > app\api\stats\route.ts

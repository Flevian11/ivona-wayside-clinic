<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;background:#f4f7f5;padding:32px 12px;font-family:Arial,Helvetica,sans-serif;color:#183329">
  <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #dce8e0;border-radius:16px;padding:32px">
    <p style="margin:0 0 8px;color:#23764c;font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase">Ivona Wayside Clinic</p>
    <h1 style="margin:0 0 16px;font-size:24px">Your sign-in verification code</h1>
    <p style="font-size:15px;line-height:1.6">Use this one-time code to finish signing in. Do not share it with anyone, including clinic support staff.</p>
    <div style="margin:24px 0;padding:18px;background:#f0f7f2;border-radius:12px;text-align:center;font-size:32px;font-weight:700;letter-spacing:8px">{{ $code }}</div>
    <p style="font-size:14px;line-height:1.6">This code expires in {{ $expiresInMinutes }} minutes and can only be used once. If you did not attempt to sign in, you can ignore this email and consider changing your password.</p>
    <p style="margin:24px 0 0;color:#65766b;font-size:12px">Automated security message — please do not reply.</p>
  </div>
</body>
</html>

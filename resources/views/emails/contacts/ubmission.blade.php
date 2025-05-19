<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Contact Form Submission</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f4f6fb;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 4px 24px rgba(34, 34, 59, 0.08);
            overflow: hidden;
        }

        .header {
            background: #f7c873;
            color: #22223b;
            padding: 28px 32px 12px 32px;
            text-align: center;
        }

        .logo {
            width: 70px;
            margin-bottom: 8px;
        }

        .title {
            font-size: 1.3em;
            font-weight: 600;
            margin-bottom: 2px;
            letter-spacing: 0.5px;
        }

        .content {
            padding: 24px 32px;
        }

        .field {
            margin-bottom: 16px;
        }

        .label {
            font-weight: bold;
            color: #22223b;
            margin-bottom: 4px;
        }

        .value {
            color: #444;
            line-height: 1.6;
        }

        .footer {
            background: #22223b;
            color: #fff;
            text-align: center;
            padding: 16px;
            font-size: 0.97em;
        }

        .footer a {
            color: #f7c873;
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="{{ asset('assets/logo.png') }}" alt="Logo" class="logo">
            <div class="title">New Contact Form Submission</div>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">Name:</div>
                <div class="value">{{ $data['name'] }}</div>
            </div>
            <div class="field">
                <div class="label">Email:</div>
                <div class="value">{{ $data['email'] }}</div>
            </div>
            <div class="field">
                <div class="label">Phone:</div>
                <div class="value">{{ $data['phone'] ?? 'Not provided' }}</div>
            </div>
            <div class="field">
                <div class="label">Message:</div>
                <div class="value">{!! nl2br(e($data['message'])) !!}</div>
            </div>
        </div>
        <div class="footer">
            This message was sent from your website contact form &mdash; <a href="{{ url('/') }}">Visit Website</a>
        </div>
    </div>
</body>

</html>

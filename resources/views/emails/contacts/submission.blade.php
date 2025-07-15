<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Contact Form Submission</title>
    <style>
        body {
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
            background: #f4f6fb;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }

        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(34, 34, 59, 0.12);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #E63829 0%, #ff5a01 100%);
            color: #fff;
            padding: 32px 32px 24px 32px;
            text-align: center;
            position: relative;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }

        .logo {
            width: 80px;
            margin-bottom: 16px;
            filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
            position: relative;
            z-index: 1;
        }

        .title {
            font-size: 1.5em;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
            position: relative;
            z-index: 1;
        }

        .subtitle {
            font-size: 1em;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }

        .content {
            padding: 32px;
        }

        .field {
            margin-bottom: 24px;
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #1274ef;
            transition: all 0.3s ease;
        }

        .field:hover {
            background: #f1f5f9;
            transform: translateX(4px);
        }

        .label {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .value {
            color: #334155;
            line-height: 1.6;
            font-size: 1.05em;
        }

        .message-field {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-left-color: #ff1466;
        }

        .contact-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
        }

        .footer {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: #e2e8f0;
            text-align: center;
            padding: 24px;
            font-size: 0.95em;
        }

        .footer a {
            color: #ff5a01;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
        }

        .footer a:hover {
            color: #E63829;
        }

        .badge {
            display: inline-block;
            background: #1274ef;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: 600;
            margin-left: 8px;
        }

        @media (max-width: 600px) {
            .container {
                margin: 20px 10px;
            }

            .content {
                padding: 24px 20px;
            }

            .contact-info {
                grid-template-columns: 1fr;
            }

            .field {
                padding: 16px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="{{ asset('assets/logo.png') }}" alt="Logo" class="logo">
            <div class="title">New Contact Form Submission</div>
            <div class="subtitle">You have received a new message from your website</div>
        </div>
        <div class="content">
            <div class="contact-info">
                <div class="field">
                    <div class="label">Name</div>
                    <div class="value">{{ $data['name'] }}</div>
                </div>
                <div class="field">
                    <div class="label">Email</div>
                    <div class="value">{{ $data['email'] }}</div>
                </div>
            </div>
            
            <div class="field">
                <div class="label">Phone <span class="badge">Optional</span></div>
                <div class="value">{{ $data['phone'] ?? 'Not provided' }}</div>
            </div>
            
            <div class="field message-field">
                <div class="label">Message</div>
                <div class="value">{!! nl2br(e($data['message'])) !!}</div>
            </div>
        </div>
        <div class="footer">
            This message was sent from your website contact form &mdash; 
            <a href="{{ url('/') }}">Visit Website</a>
        </div>
    </div>
</body>

</html>

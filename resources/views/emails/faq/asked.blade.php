<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>FAQ Notification</title>
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
            background: linear-gradient(135deg, #1274ef 0%, #4F46E5 100%);
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

        .meta {
            margin: 24px 32px 0 32px;
            color: #6B7280;
            font-size: 0.95em;
            text-align: center;
            background: #f8fafc;
            padding: 16px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
        }

        .meta strong {
            color: #374151;
        }

        .faq-box {
            border-left: 4px solid {{ $data['color'] ?? '#1274ef' }};
            padding: 24px;
            margin: 24px 32px 32px 32px;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }

        .faq-box:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .question {
            font-weight: 600;
            font-size: 1.1em;
            margin-bottom: 8px;
            color: #1e293b;
            line-height: 1.5;
        }

        .question::before {
            content: '❓';
            margin-right: 8px;
            font-size: 1.2em;
        }

        .answer {
            color: #374151;
            font-size: 1em;
            line-height: 1.6;
            background: white;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            margin-top: 12px;
        }

        .answer::before {
            content: '💡';
            margin-right: 8px;
            font-size: 1.1em;
        }

        .footer {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: #e2e8f0;
            text-align: center;
            padding: 24px;
            font-size: 0.95em;
        }

        .footer a {
            color: #1274ef;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
        }

        .footer a:hover {
            color: #4F46E5;
        }

        .status-badge {
            display: inline-block;
            background: {{ $data['color'] ?? '#1274ef' }};
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: 600;
            margin-left: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 600px) {
            .container {
                margin: 20px 10px;
            }

            .header,
            .meta,
            .faq-box {
                margin-left: 20px;
                margin-right: 20px;
            }

            .faq-box {
                padding: 20px;
            }

            .meta {
                margin-top: 20px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="{{ asset('assets/logo.png') }}" alt="Logo" class="logo">
            <div class="title">New FAQ Question Received</div>
            <div class="subtitle">A visitor has asked a question on your website</div>
        </div>
        <div class="meta">
            <strong>From:</strong> {{ $data['email'] ?? 'Anonymous' }}
            <span class="status-badge">New Question</span>
        </div>
        <div class="faq-box">
            <div class="question">{{ $data['question'] }}</div>
            @if(isset($data['answer']) && $data['answer'])
                <div class="answer">{{ $data['answer'] }}</div>
            @endif
        </div>
        <div class="footer">
            This message was sent from your website FAQ form &mdash;
            <a href="{{ url('/') }}">Visit Website</a>
        </div>
    </div>
</body>

</html>

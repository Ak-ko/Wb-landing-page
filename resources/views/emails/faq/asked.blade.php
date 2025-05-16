<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>FAQ Notification</title>
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
            background: #FFD36B;
            color: #1F2937;
            padding: 28px 32px 12px 32px;
            text-align: center;
        }

        .logo {
            width: 70px;
            margin-bottom: 8px;
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
        }

        .title {
            font-size: 1.4em;
            font-weight: 600;
            margin-bottom: 6px;
        }

        .subtitle {
            font-size: 1em;
            color: #374151;
        }

        .meta {
            margin: 24px 0 0 0;
            color: #6B7280;
            font-size: 0.95em;
            text-align: center;
        }

        .faq-box {
            border-left: 4px solid {{ $data['color'] ?? '#4F46E5' }};
            padding: 20px 24px;
            margin: 28px 24px 32px 24px;
            background: #F9FAFB;
            border-radius: 10px;
        }

        .question {
            font-weight: 600;
            font-size: 1.05em;
            margin-bottom: 6px;
            color: #111827;
        }

        .answer {
            color: #374151;
            font-size: 0.97em;
            line-height: 1.6;
        }

        .footer {
            background: #1F2937;
            color: #E5E7EB;
            text-align: center;
            padding: 16px;
            font-size: 0.96em;
            border-bottom-left-radius: 14px;
            border-bottom-right-radius: 14px;
        }

        .footer a {
            color: #FFD36B;
            text-decoration: underline;
        }

        @media (max-width: 600px) {
            .container {
                margin: 20px 10px;
            }

            .faq-box,
            .header {
                padding: 16px;
            }

            .meta {
                margin: 16px 0 0;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="{{ asset('assets/logo.png') }}" alt="Logo" class="logo">
            <div class="title">A New FAQ Question Was Asked</div>
            <div class="subtitle">You received a new question from your website FAQ form.</div>
        </div>
        <div class="meta">
            <strong>From:</strong> {{ $data['email'] ?? 'N/A' }}
        </div>
        <div class="faq-box">
            <div class="question">Q: {{ $data['question'] }}</div>
        </div>
        <div class="footer">
            This message was sent from your website FAQ form &mdash;
            <a href="{{ url('/') }}">Visit Website</a>
        </div>
    </div>
</body>

</html>

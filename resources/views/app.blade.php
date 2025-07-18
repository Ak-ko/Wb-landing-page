<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="description" content="Walking Brands Design and Art Consultancy is a creative design studio based in Asia, offering branding, visual design, and art consultancy services. Explore our portfolio and creative process.">
    <meta name="keywords" content="Walking Brands, Walking Brands Design and Art Consultancy, design studio Asia, branding, art consultancy, creative agency, graphic design">
    <meta name="author" content="Walking Brands Design and Art Consultancy">

    <meta property="og:title" content="Walking Brands Design and Art Consultancy | Design Studio in Asia">
    <meta property="og:description" content="Explore the creative work of Walking Brands Design and Art Consultancy — a design studio based in Asia offering branding and art consultancy services.">
    <meta property="og:image" content="/assets/logo.png">
    <meta property="og:url" content="https://walkingbrands.co">
    <meta property="og:type" content="website">

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-GRJP4SEMXS"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-GRJP4SEMXS');
    </script>



    <script>
        // (function() {
        /*
        const appearance = '{{ $appearance ?? 'system' }}';

        if (appearance === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (prefersDark) {
                document.documentElement.classList.add('dark');
            }
        }
            */
        // })();
    </script>

    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <title inertia>{{ config('app.name', 'Walking Brands') }}</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <link rel="icon" href="/assets/logo.png" />

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>

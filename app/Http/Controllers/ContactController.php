<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormSubmission;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
        ]);

        $subject = 'Contact Us !';

        $adminEmail = config('app.admin_email');

        $googleScriptUrl = config('app.google_script_url');

        $htmlBody = view('emails.contacts.submission', ['data' => $validated, 'subject' => $subject])->render();

        try {
            $response = Http::post($googleScriptUrl, [
                'type' => 'Contact Us',
                'from' => "{$validated['name']} | {$validated['email']} | {$validated['phone']}",
                'to' => $adminEmail,
                'subject' => $subject,
                'body' => $validated['message'],
                'bodyHtml' => $htmlBody,
            ]);

            if ($response->successful()) {
                return back()->with('success', 'Email sent successfully!');
            } else {
                Log::error('Email API call failed.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return back()->with('error', 'Failed to send the email. Please try again later.');
            }
        } catch (\Exception $e) {
            Log::error('Email sending exception', [
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'An unexpected error occurred while sending the email.');
        }
    }

    // public function sendMessage(Request $request)
    // {
    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|email|max:255',
    //         'phone' => 'nullable|string|max:20',
    //         'message' => 'required|string',
    //     ]);


    //     $subject = 'Contact Us !';

    //     $adminEmail = config('app.admin_email');

    //     Mail::to($adminEmail)->send(new ContactFormSubmission($validated, $subject));

    //     return back()->with('success', 'Your message has been sent successfully!');
    // }
}

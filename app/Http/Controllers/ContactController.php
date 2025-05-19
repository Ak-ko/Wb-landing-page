<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormSubmission;
use Illuminate\Http\Request;
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

        Mail::to($adminEmail)->send(new ContactFormSubmission($validated, $subject));

        return back()->with('success', 'Your message has been sent successfully!');
    }
}

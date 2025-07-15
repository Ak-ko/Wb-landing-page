<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactFormSubmission extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public $data, public $subject)
    {
        //
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: $this->data['email'],
            subject: $this->subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contacts.submission',
            with: ['data' => $this->data],
        );
    }
}

<?php

namespace App\Http\Controllers;

use App\Mail\FaqAskedMail;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FaqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Faq::query();

        if ($request->has('query') && $request->query('query') !== '') {
            $searchQuery = $request->query('query');
            $query->where(function ($q) use ($searchQuery) {
                $q->where('question', 'like', "%{$searchQuery}%")
                    ->orWhere('answer', 'like', "%{$searchQuery}%");
            });
        }

        $faqs = $query->latest()
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        return Inertia::render('admin/faq/index', [
            'faqs' => $faqs,
            'filters' => $request->only(['query']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/faq/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'color' => 'required|string',
            'is_published' => 'boolean',
        ]);

        Faq::create([
            'question' => $validated['question'],
            'answer' => $validated['answer'],
            'color' => $validated['color'],
            'is_published' => $validated['is_published'] ?? true,
        ]);

        return redirect()->route('faqs.index')->with('success', 'FAQ created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Faq $faq)
    {
        return Inertia::render('admin/faq/show', [
            'faq' => $faq,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Faq $faq)
    {
        return Inertia::render('admin/faq/edit', [
            'faq' => $faq,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'color' => 'required|string',
            'is_published' => 'boolean',
        ]);

        $faq->update([
            'question' => $validated['question'],
            'answer' => $validated['answer'],
            'color' => $validated['color'] ?? $faq->color,
            'is_published' => $validated['is_published'] ?? $faq->is_published,
        ]);

        return redirect()->route('faqs.index')
            ->with('success', 'FAQ updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faq $faq)
    {
        $faq->delete();

        return redirect()->route('faqs.index')->with('success', 'FAQ deleted successfully.');
    }

    public function sendFaqEmail()
    {
        $cleanData = request()->validate([
            'email' => 'required|email',
            'question' => 'required|string|max:255',
        ]);

        $subject = 'A Question is Asked !';

        $adminEmail = config('app.admin_email');
        $googleScriptUrl = config('app.google_script_url');

        $data = [
            'email' => $cleanData['email'],
            'question' => $cleanData['question'],
            'answer' => null,
            'color' => '#1274ef'
        ];

        $htmlBody = view('emails.faq.asked', ['data' => $data])->render();

        try {
            $response = Http::post($googleScriptUrl, [
                'type' => 'FAQ',
                'from' => $cleanData['email'],
                'to' => $adminEmail,
                'subject' => $subject,
                'body' => $cleanData['question'],
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

    /**
     * Get all published FAQs for frontend
     */
    public function getAllFaqs()
    {
        if (request()->expectsJson()) {
            $faqs = Faq::published()->get();
            return response()->json($faqs);
        }
    }

    // public function sendFaqEmail()
    // {
    //     $cleanData = request()->validate([
    //         'email' => 'required|email',
    //         'question' => 'required|string|max:255',
    //     ]);

    //     $subject = 'A Question is Asked !';

    //     $adminEmail = config('app.admin_email');

    //     Mail::to([$adminEmail, $cleanData['email']])->send(new FaqAskedMail($cleanData, $subject));

    //     return back()->with('success', 'Email sent successfully!');
    // }
}

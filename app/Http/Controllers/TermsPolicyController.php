<?php

namespace App\Http\Controllers;

use App\Models\CompanyPolicy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TermsPolicyController extends Controller
{
    public function index()
    {
        $policy = CompanyPolicy::first();

        return inertia('admin/terms-policies/index', [
            'policy' => $policy
        ]);
    }

    public function updateTermsPolicy(Request $request)
    {
        $policy = CompanyPolicy::where('user_id', Auth::id())->first();

        if (!$policy) {
            $policy = CompanyPolicy::create(['user_id' => Auth::id()]);
        }

        $cleanData = $request->validate([
            'content' => 'required',
            'type' => 'required|in:terms_and_conditions,terms_and_conditions_for_art_services'
        ]);

        if ($cleanData['type'] == 'terms_and_conditions') {
            $policy->update([
                'terms_and_conditions' => $cleanData['content']
            ]);
        }

        if ($cleanData['type'] == 'terms_and_conditions_for_art_services') {
            $policy->update([
                'terms_and_conditions_for_art_services' => $cleanData['content']
            ]);
        }

        return redirect()->back()->with('success', "Terms and Conditions Updated Successfully");
    }
}

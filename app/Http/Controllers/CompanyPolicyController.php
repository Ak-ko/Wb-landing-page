<?php

namespace App\Http\Controllers;

use App\Models\CompanyPolicy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CompanyPolicyController extends Controller
{
    public function index()
    {
        $policy = CompanyPolicy::first();

        return inertia('admin/policies/index', [
            'policy' => $policy
        ]);
    }

    public function updatePolicy(Request $request)
    {
        $policy = CompanyPolicy::where('user_id', Auth::id())->first();

        $cleanData = $request->validate([
            'content' => 'required',
            'type' => 'required|in:mission,vision,terms_and_conditions,core_values'
        ]);

        if ($cleanData['type'] == 'terms_and_conditions') {
            $policy->update([
                'terms_and_conditions' => $cleanData['content']
            ]);
        }

        if ($cleanData['type'] == 'mission') {
            $policy->update([
                'mission' => $cleanData['content']
            ]);
        }

        if ($cleanData['type'] == 'vision') {
            $policy->update([
                'vision' => $cleanData['content']
            ]);
        }

        if ($cleanData['type'] == 'core_values') {
            $policy->update([
                'core_values' => $cleanData['content']
            ]);
        }

        return redirect()->back()->with('success', "Policy Updated Successfully");
    }
}

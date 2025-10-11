<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Administrator;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate(['email'=>'required|email','password'=>'required']);
        $admin = Administrator::where('email',$request->email)->first();
        if (!$admin || !Hash::check($request->password,$admin->password)) return response()->json(['message'=>'Invalid credentials'],401);
        $token = $admin->createToken('admin-token')->plainTextToken;
        return response()->json(['admin'=>$admin,'token'=>$token]);
    }

    public function register(Request $request)
    {
        $request->validate(['first_name'=>'required','last_name'=>'required','email'=>'required|email|unique:administrators,email','password'=>'required|min:6']);
        $admin = Administrator::create($request->only(['first_name','last_name','email','password']));
        return response()->json(['message'=>'Administrator created','admin'=>$admin],201);
    }

    public function list()
    {
        $administrators = Administrator::all();
        return response()->json(['administrators' => $administrators]);
    }

    public function update(Request $request, $id)
    {
        $admin = Administrator::findOrFail($id);
        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:administrators,email,' . $id,
            'password' => 'nullable|min:6'
        ]);
        
        $data = $request->only(['first_name', 'last_name', 'email']);
        if ($request->filled('password')) {
            $data['password'] = $request->password;
        }
        
        $admin->update($data);
        return response()->json(['message' => 'Administrator updated successfully', 'admin' => $admin]);
    }

    public function destroy($id)
    {
        $admin = Administrator::findOrFail($id);
        $admin->delete();
        return response()->json(['message' => 'Administrator deleted successfully']);
    }
}

<?php



namespace App\Http\Controllers\Api;




use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use App\Mail\RegistrationConfirmed;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // POST /api/register
    // public function register(Request $request)
    // {
    //     $request->validate([
    //         'first_name' => 'required|string',
    //         'last_name'  => 'required|string',
    //         'email'      => 'required|email|unique:users,email',
    //         'phone'      => 'nullable|string',
    //         'pin'        => 'required|string|size:8',
    //         'g_recaptcha_response' => 'nullable|string'
    //     ]);

    //     // (Optional) Verify CAPTCHA
    //     if ($request->filled('g_recaptcha_response')) {
    //         $captcha = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
    //             'secret' => config('services.recaptcha.secret'),
    //             'response' => $request->g_recaptcha_response,
    //             'remoteip' => $request->ip(),
    //         ]);
    //         if (!$captcha->json('success')) {
    //             return response()->json(['message' => 'Captcha failed'], 422);
    //         }
    //     }

    //     $user = User::create($request->only(['first_name','last_name','email','phone','pin']));

    //     $token = $user->createToken('visitor-token')->plainTextToken;

    //     // TODO: Uncomment when email template is created
    //     //Mail::to($user->email)->send(new RegistrationConfirmed($user));

    //     return response()->json([
    //         'message' => 'Registration successful',
    //         'user' => $user,
    //         'token' => $token
    //     ]);
    // }

    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'first_name' => 'required|string',
                'last_name'  => 'required|string',
                'email'      => 'required|email|unique:users,email',
                'phone'      => 'nullable|string',
                'pin'        => 'required|string|size:8',
                'g_recaptcha_response' => 'nullable|string'
            ]);

            // Verify CAPTCHA if provided
            if ($request->filled('g_recaptcha_response')) {
                $captcha = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                    'secret' => config('services.recaptcha.secret'),
                    'response' => $request->g_recaptcha_response,
                    'remoteip' => $request->ip(),
                ]);
                if (!$captcha->json('success')) {
                    return response()->json(['message' => 'Captcha verification failed'], 422);
                }
            }
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    
        $user = User::create($validated);
        $token = $user->createToken('visitor-token')->plainTextToken;
    
        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token,
        ], 201);
    }




    // POST /api/login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'pin'   => 'required|string|size:8',
        ]);

        $user = User::where('email', $request->email)
            ->where('pin', $request->pin)
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('visitor-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ]);
    }
}

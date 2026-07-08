<?php

namespace App\Services;

use App\Models\User;

class FaceVerificationService
{
    private const MATCH_THRESHOLD = 0.6;

    public function enroll(User $user, array $descriptor): User
    {
        if (count($descriptor) !== 128) {
            throw new \InvalidArgumentException('Face descriptor must contain exactly 128 values');
        }

        $user->update([
            'face_descriptor' => $descriptor,
            'face_enrolled_at' => now(),
        ]);

        return $user->fresh();
    }

    public function isEnrolled(User $user): bool
    {
        return !empty($user->face_descriptor) && is_array($user->face_descriptor);
    }

    public function verify(User $user, array $descriptor): bool
    {
        if (!$this->isEnrolled($user)) {
            throw new \Exception('Face not enrolled. Please register your face in Profile first.');
        }

        if (count($descriptor) !== 128) {
            throw new \InvalidArgumentException('Face descriptor must contain exactly 128 values');
        }

        $stored = $user->face_descriptor;
        $distance = $this->euclideanDistance($stored, $descriptor);

        return $distance < self::MATCH_THRESHOLD;
    }

    public function getMatchDistance(User $user, array $descriptor): float
    {
        return $this->euclideanDistance($user->face_descriptor, $descriptor);
    }

    private function euclideanDistance(array $a, array $b): float
    {
        $sum = 0.0;
        for ($i = 0; $i < 128; $i++) {
            $diff = (float) $a[$i] - (float) $b[$i];
            $sum += $diff * $diff;
        }

        return sqrt($sum);
    }
}

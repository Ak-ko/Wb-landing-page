<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FileFullyUploadedAndReadyToSync
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $filepondIds;
    public $targetDirectory;
    public $targetDisk;
    public $userId;

    /**
     * Create a new event instance.
     *
     * @param array $filepondIds Array of FilePond IDs to process
     * @param string $targetDirectory Target directory for permanent storage
     * @param string $targetDisk Target disk for permanent storage
     * @param int|null $userId User ID who triggered the event
     */
    public function __construct(array $filepondIds, string $targetDirectory = 'images', string $targetDisk = 'public', ?int $userId = null)
    {
        $this->filepondIds = $filepondIds;
        $this->targetDirectory = $targetDirectory;
        $this->targetDisk = $targetDisk;
        $this->userId = $userId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}

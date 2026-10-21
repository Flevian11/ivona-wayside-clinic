<?php

namespace Tests\Feature;

use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class PublicPagesTest extends TestCase
{
    public function test_public_information_pages_render_their_dedicated_components(): void
    {
        $pages = [
            '/about' => 'public/about',
            '/services' => 'public/services',
            '/blog' => 'public/blog',
            '/careers' => 'public/careers',
            '/privacy' => 'public/legal',
            '/terms' => 'public/legal',
            '/gdpr' => 'public/legal',
        ];

        foreach ($pages as $url => $component) {
            $response = $this->get($url);
            $response->assertOk();
            $response->assertInertia(fn (Assert $page) => $page->component($component));
        }
    }

    public function test_legal_pages_receive_the_correct_document_key(): void
    {
        $this->get('/privacy')->assertInertia(fn (Assert $page) => $page->where('pageKey', 'privacy'));
        $this->get('/terms')->assertInertia(fn (Assert $page) => $page->where('pageKey', 'terms'));
        $this->get('/gdpr')->assertInertia(fn (Assert $page) => $page->where('pageKey', 'data-protection'));
    }
}

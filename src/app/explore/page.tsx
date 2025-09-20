 'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle } from 'lucide-react'

export default function ExplorePage() {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(42)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<string[]>([
    'Great post!',
    'Looks amazing — would try this!'
  ])
  const [newComment, setNewComment] = useState('')

  const toggleLike = () => {
    setLiked((v) => {
      setLikes((l) => (v ? l - 1 : l + 1))
      return !v
    })
  }

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault()
    const text = newComment.trim()
    if (!text) return
    setComments((c) => [text, ...c])
    setNewComment('')
    setShowComments(true)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore</h1>

      <div className="max-w-2xl mx-auto">
        <Card className="bg-card/50">
          <CardContent className="p-4 md:p-6">
            {/* Image preview (placeholder) */}
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-zinc-900 flex items-center justify-center mb-4">
              <span className="text-muted-foreground">Generated image preview</span>
            </div>

            {/* Caption / post text */}
            <p className="mb-4 text-base leading-relaxed">
              This is a preview caption for a generated post. When the generator runs, the real caption and image will replace this preview.
            </p>

            {/* Actions: Like & Comment */}
            <div className="flex items-center gap-3 mb-4">
              <Button
                onClick={toggleLike}
                className={`rounded-md px-3 py-2 flex items-center gap-2 ${liked ? 'bg-destructive text-destructive-foreground' : ''}`}
              >
                <Heart className="h-4 w-4" />
                <span className="text-sm">{likes}</span>
              </Button>

              <Button
                onClick={() => setShowComments((s) => !s)}
                variant="outline"
                className="rounded-md px-3 py-2 flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">Comments ({comments.length})</span>
              </Button>
            </div>

            {/* Comments section (toggle) */}
            {showComments && (
              <div className="space-y-3">
                <form onSubmit={submitComment} className="flex gap-2">
                  <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm"
                  />
                  <Button type="submit" className="rounded-md">Post</Button>
                </form>

                <div className="space-y-2">
                  {comments.map((c, i) => (
                    <div key={i} className="text-sm bg-muted/20 p-2 rounded">
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

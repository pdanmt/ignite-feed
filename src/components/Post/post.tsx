import styles from './Post.module.css'

import { UserImage } from '../userImage/userImg'
import { Comment } from '../Comment/comment'
import { useContext } from 'react'
import { postsBody, UserContext } from '../../contexts/userContext'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AddComment } from '../../services/acess/userAcess'
import { doc } from 'firebase/firestore'
import { db } from '../../firebase-config'

export function Post({
  contentPost,
  createdAt,
  role,
  idOfPost,
  userName,
  userProfilePhoto,
}: postsBody) {
  const { user, comments } = useContext(UserContext)

  const commentSchema = z.object({
    contentComment: z.string(),
  })

  type commentDataType = z.infer<typeof commentSchema>

  const { handleSubmit, register, reset } = useForm<commentDataType>({
    resolver: zodResolver(commentSchema),
  })

  function addComment({ contentComment }: commentDataType) {
    const createdAt = String(new Date())
    const userRef = doc(db, '/users', user.uid)
    const likes = 0

    AddComment({ contentComment, createdAt, likes, userRef, postId: idOfPost })

    reset()
  }

  return (
    <div className={styles.post}>
      {/* post */}
      <header>
        <section className={styles.profile}>
          <UserImage img={userProfilePhoto} />
          <section>
            <strong className={styles.userName}>{userName}</strong>
            <p className={styles.roleProfile}>{role}</p>
          </section>
        </section>
        <time
          title={`Publicado em :${createdAt}`}
          dateTime={`Publicado às ${createdAt}`}
          className={styles.date}
        >
          publicado há{' '}
          {formatDistanceToNow(new Date(createdAt), { locale: ptBR })}
        </time>
      </header>
      <main>{contentPost}</main>

      {/* comentários */}
      <form className={styles.feedback} onSubmit={handleSubmit(addComment)}>
        <strong>Deixe seu feedback</strong>
        <textarea
          className={styles.comentario}
          required={true}
          placeholder="Escreva um comentário"
          {...register('contentComment')}
        />
        <footer>
          <button className={styles.buttonPublish}>Publicar</button>
        </footer>
      </form>
      <div className={styles.comments}>
        {comments.map(
          ({
            contentComment,
            createdAt,
            likedBy,
            userPhoto,
            userName,
            id,
            postId,
          }) => {
            if (postId === idOfPost) {
              return (
                <Comment
                  contentComment={contentComment}
                  createdAt={createdAt}
                  likes={likedBy}
                  userName={userName}
                  userPhoto={userPhoto}
                  key={id}
                  id={id}
                />
              )
            }

            return null
          },
        )}
      </div>
    </div>
  )
}
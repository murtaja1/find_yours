import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import useStyles from './style'
import { ThemeProvider } from '@material-ui/styles'
import { theme } from './style'
import {
  Container,
  Grid,
  Typography,
  CardMedia,
  Divider,
  Paper,
  Box,
  Button,
  Dialog,
} from '@material-ui/core'
import { db } from '../../firebase'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useTranslation } from 'react-i18next'
import { ProfileContext } from '../../profileContext'
import EditForm from './EditForm'

function ViewPost(props) {
  const { t } = useTranslation()
  const classes = useStyles()
  const [updated, setUpdated] = useState(false)
  const [post, setPosts] = useState()
  useEffect(() => {
    const fetch = () => {
      db.collection('posts')
        .doc(props.match.params.id)
        .get()
        .then((docRef) => {
          setPosts(docRef.data())
        })
        .catch((error) => {
          alert(error)
        })
    }
    fetch()
    return fetch()
  }, [props.match.params.id, updated])

  const handleUpdated = () => {
    setUpdated(!updated)
  }

  return (
    <>
      <Container>
        <Box mt={11} mb={2}>
          {post ? (
            <Paper className={classes.paper}>
              <ThemeProvider theme={theme}>
                <Typography variant='h5' className={classes.headerTypo}>
                  {t('viewPost.info')}
                </Typography>
                <Grid container>
                  <Grid item xs={12} sm={8} md={4}>
                    <CardMedia className={classes.media} component='img' src={post.image} />
                  </Grid>
                  <Grid container item sm={12} md={8}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box px={2} py={1}>
                        <Typography variant='body1' color='textSecondary'>
                          {t('form.title')}
                        </Typography>
                        <Typography variant='body1'>{post.title}</Typography>
                        <Divider />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box px={2} py={1}>
                        <Typography variant='body1' color='textSecondary'>
                          {t('form.date')}
                        </Typography>
                        <Typography variant='body1'>{post.date}</Typography>
                        <Divider />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box px={2} py={1}>
                        <Typography variant='body1' color='textSecondary'>
                          {t('viewPost.place')}
                        </Typography>
                        <Typography variant='body1'>{post.province}</Typography>
                        <Divider />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Box px={2} py={1}>
                        <Typography variant='body1' color='textSecondary'>
                          {t('filter.color')}
                        </Typography>
                        <Typography variant='body1'>{post.color}</Typography>
                        <Divider />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box px={2} py={1}>
                        <Typography variant='body1' color='textSecondary'>
                          {t('filter.catagory')}
                        </Typography>
                        <Typography variant='body1'>{post.category}</Typography>
                        <Divider />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box px={2} py={1}>
                        <Typography variant='body1' color='textSecondary'>
                          {t('form.addInfo')}
                        </Typography>
                        <Typography variant='body1'>
                          {post.body.map((word, i) => (
                            <span key={i}>{word} </span>
                          ))}
                        </Typography>
                        <Divider />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                <Typography variant='h5' className={classes.typo1}>
                  {t('form.contact')}
                </Typography>

                <Grid container spacing={3} className={classes.container3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='body1' color='textSecondary'>
                      {t('viewPost.name')}
                    </Typography>
                    <Typography variant='body1'>{post.name}</Typography>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='body1' color='textSecondary'>
                      {t('form.facebook')}
                    </Typography>
                    <Typography variant='body1'>
                      {post.facebook ? (
                        <a href={post.facebook}>{post.facebook}</a>
                      ) : (
                        'No Account Provided.'
                      )}
                    </Typography>
                    <Divider />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant='body1' color='textSecondary'>
                      {t('form.email')}
                    </Typography>
                    <Typography variant='body1'>
                      {post.email ? (
                        <a href={`mailto:${post.email}`}>{post.email}</a>
                      ) : (
                        'No Email Provided.'
                      )}
                    </Typography>
                    <Divider />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant='body1' color='textSecondary'>
                      {t('form.phone')}
                    </Typography>
                    <Typography variant='body1'>
                      {post.phone ? post.phone : 'No Phone Number Provided.'}
                    </Typography>
                    <Divider />
                  </Grid>
                  {/* the delete post component */}
                  <DeletePost
                    postId={props.match.params.id}
                    handleUpdated={handleUpdated}
                    post={post}
                  />
                </Grid>
              </ThemeProvider>
            </Paper>
          ) : (
            <Grid container justify='center' style={{ padding: '300px' }}>
              <CircularProgress />
            </Grid>
          )}
        </Box>
      </Container>
    </>
  )
}

export default ViewPost

function DeletePost({ postId, post, handleUpdated }) {
  const [openDialog, setOpenDialog] = useState(false)
  const classes = useStyles()
  const [profile] = useContext(ProfileContext)
  const { t } = useTranslation()
  const history = useHistory()
  const handleDelete = () => {
    db.collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        setOpenDialog(!openDialog)
        history.push('/dashboard')
      })
      .catch((error) => {
        alert('Error removing document: ', error)
      })
  }
  const handleDeleteDialog = () => {
    setOpenDialog(!openDialog)
  }
  return (
    <>
      <Dialog
        aria-labelledby='simple-dialog-title'
        open={openDialog}
        BackdropProps={{
          classes: {
            root: classes.backDrop,
          },
        }}>
        <Box py={2} px={2}>
          <Typography variant='h5' className={classes.headerTypo}>
            {t('post.confirm')}
          </Typography>
          <Grid container justify='center'>
            <Box pr={1} pt={2} component='span'>
              <Button variant='contained' color='primary' size='small' onClick={handleDelete}>
                {t('post.yes')}
              </Button>
            </Box>
            <Box pt={2} component='span'>
              <Button
                variant='contained'
                color='secondary'
                size='small'
                onClick={handleDeleteDialog}>
                {t('post.cancel')}
              </Button>
            </Box>
          </Grid>
        </Box>
      </Dialog>
      {profile.googleId === post.userId && (
        <Grid item xs={12} sm={6}>
          <Box pr={1} component='span'>
            <Button onClick={handleDeleteDialog} variant='contained' color='secondary' size='small'>
              {t('post.delete')}
            </Button>
          </Box>
          {/* the edit component */}
          <EditForm post={post} postId={postId} handleUpdated={handleUpdated} />
        </Grid>
      )}
    </>
  )
}

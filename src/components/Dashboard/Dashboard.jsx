import React, { useContext, useState, useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { Avatar, IconButton, Typography, Container } from '@material-ui/core'
import SearchBar from 'material-ui-search-bar'
import LinearProgress from '@material-ui/core/LinearProgress'
import FilterListIcon from '@material-ui/icons/FilterList'
import Popover from '@material-ui/core/Popover'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import { useStyles } from './styles.js'
import Post from './Post/Post'
import Cities from './Widgets/Cities'
import Filters from './Widgets/Filters'
import { useStyleDashboard } from './Widgets/Style'
import { ProfileContext } from '../../profileContext'
import { db } from '../../firebase'
import { FORM_ROUTE, PROFILE_ROUTE } from '../../containers/routes'
import NotFound from '../../images/notFound.svg'

export default function Dashboard() {
  const { t } = useTranslation()
  const [profile] = useContext(ProfileContext)
  const [posts, setPosts] = useState()
  const [isLoading, setLoading] = useState(false)
  const classes = useStyles()
  const [showMoreBtn, setShowMoreBtn] = useState(true)
  const [postsNum, setPostsNum] = useState(10)
  const [doubleFilter, setDubleFilter] = useState({})
  const [search, setSearch] = useState([])
  const mobileView = useMediaQuery('(max-width: 960px)')
  const mediumView = useMediaQuery('(max-width: 1210px)')

  const handlePosts = (filterState) => {
    // to handle both the filters and cities queries.
    if (filterState.city === true) {
      const { province } = filterState
      setDubleFilter({ ...doubleFilter, province })
    } else if (filterState.province != '') {
      const { color, category, Status, province } = filterState
      setDubleFilter({ ...doubleFilter, color, category, Status, province })
    } else {
      const { color, category, Status } = filterState
      setDubleFilter({ ...doubleFilter, color, category, Status })
    }
  }
  const handleClearFilter = () => {
    setDubleFilter({})
  }
  useEffect(() => {
    const fetch = () => {
      const query = db.collection('posts')
      const categoryQuery = doubleFilter.category
        ? query.where('category', '==', doubleFilter['category'])
        : query
      const colorQuery = doubleFilter.color
        ? categoryQuery.where('color', '==', doubleFilter['color'])
        : categoryQuery
      const provinceQuery = doubleFilter.province
        ? colorQuery.where('province', '==', doubleFilter['province'])
        : colorQuery
      const check = doubleFilter['Status'] === 'true' ? true : false
      const isLostQuery = doubleFilter.Status
        ? provinceQuery.where('isLost', '==', check)
        : provinceQuery
      const res = []
      isLostQuery
        .limit(postsNum)
        .get()
        .then((snapshot) => {
          snapshot.docs.map((doc) =>
            res.push({
              id: doc.id,
              ...doc.data(),
            })
          )
          setPosts(res)
        })
      // to handle whether to show the show more btn or not.
      isLostQuery.get().then((snap) => setShowMoreBtn(snap.size > postsNum))
    }
    fetch()
    return fetch()
  }, [doubleFilter, postsNum])

  const handleSearchInput = (e) => {
    setSearch(e.split(' '))
  }

  const handlefetch = () => {
    const res = []
    const query = db.collection('posts')
    if (search.length != 0) {
      setLoading(true)
      query
        .where('category ', '==', search[0])
        .get()
        .then((snapshot) => {
          snapshot.docs.map((doc) =>
            res.push({
              id: doc.id,
              ...doc.data(),
            })
          )
        })

      query
        .where('color', '==', search[0])
        .get()
        .then((snapshot) => {
          snapshot.docs.map((doc) =>
            res.push({
              id: doc.id,
              ...doc.data(),
            })
          )
        })
      query
        .where('province', '==', search[0])
        .get()
        .then((snapshot) => {
          snapshot.docs.map((doc) =>
            res.push({
              id: doc.id,
              ...doc.data(),
            })
          )
        })

      query
        .where('body', 'array-contains-any', search)
        .get()
        .then((snapshot) => {
          snapshot.docs.map((doc) =>
            res.push({
              id: doc.id,
              ...doc.data(),
            })
          )
          if (search[0] != 'found' && search[0] != 'lost') {
            setPosts(res)
            setLoading(false)
          }
        })

      if (search[0] === 'found' || search[0] === 'lost') {
        const check = search[0] === 'found' ? false : true
        query
          .where('isLost', '==', check)
          .get()
          .then((snapshot) => {
            snapshot.docs.map((doc) =>
              res.push({
                id: doc.id,
                ...doc.data(),
              })
            )
            setPosts(res)
            setLoading(false)
          })
      }
    } else {
      query.get().then((snapshot) => {
        snapshot.docs.map((doc) =>
          res.push({
            id: doc.id,
            ...doc.data(),
          })
        )
        setPosts(res)
        setLoading(false)
      })
    }
  }

  const { container, searchfield, button, widget } = useStyleDashboard()
  const middleColomn = (text) => {
    return (
      <div style={{ margin: '0 20px' }}>
        <div className={classes.messageSender}>
          <div className={classes.messageSender_top}>
            {!mobileView && (
              <span>
                {profile.length != 0 ? (
                  <Link to={PROFILE_ROUTE} className={classes.links}>
                    <Avatar src={profile.imageUrl} />
                  </Link>
                ) : (
                  <Avatar src={profile.imageUrl} />
                )}
              </span>
            )}
            <div className={classes.searchbar}>
              <SearchBar
                className={searchfield}
                // Resource: https://codesandbox.io/s/mz7nx9v02j?file=/src/appStore.js
                onChange={(e) => handleSearchInput(e)}
                onRequestSearch={handlefetch}
                placeholder={t('dash.search')}
                autoFocus
              />
              {isLoading && <LinearProgress />}
            </div>
            {mobileView && (
              <div>
                <IconButton
                  aria-label='more'
                  aria-controls='long-menu'
                  aria-haspopup='true'
                  onClick={handleClick}>
                  <FilterListIcon />
                </IconButton>

                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}>
                  <Filters handleClearFilter={handleClearFilter} handlePosts={handlePosts} />
                </Popover>
              </div>
            )}
            <div className={classes.buttons}>
              {profile.length != 0 ? (
                <Link to={FORM_ROUTE} className={classes.submitLink}>
                  <Button
                    {...{
                      className: button,
                    }}
                    variant='contained'
                    color='primary'
                    disableElevation>
                    {text}
                  </Button>
                </Link>
              ) : (
                <Button
                  {...{
                    className: button,
                  }}
                  onClick={() => alert('you need to log in to post!')}
                  variant='contained'
                  color='primary'
                  disableElevation>
                  {text}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  const postItems = () => {
    return (
      <div className={classes.posts}>
        {posts ? (
          <>
            {posts.map((post, i) => (
              <Post key={i} post={post} />
            ))}
            {showMoreBtn && (
              <Grid container item justify='center'>
                <Button onClick={() => setPostsNum(postsNum + 10)} className={classes.showMoreBtn}>
                  {t('dash.show')}
                </Button>
              </Grid>
            )}
            {posts.length < 1 ? (
              <Container>
                <Typography className={classes.notFoundText} variant='h4'>
                  No Posts Found
                </Typography>
                <img className={classes.notFoundImg} src={NotFound} />
              </Container>
            ) : null}
          </>
        ) : (
          <CircularProgress />
        )}
      </div>
    )
  }
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : 'simple-popover'
  return (
    <div>
      <Navbar />
      {mediumView && (
        <Grid container justify='center' className={container}>
          <Grid
            style={{ height: '100vh', overflowY: 'auto' }}
            item
            xs={12}
            sm={mobileView ? 12 : 8}
            lg={8}>
            {middleColomn(`${t('dash.submit')}`)}
            {postItems()}
          </Grid>
          {!mobileView && (
            <Grid item sm={4} lg={4} className={widget}>
              <div
                style={{
                  height: '100vh',
                  overflowY: 'auto',
                  width: '-webkit-fill-available',
                }}
                className={classes.widget}>
                <Filters handlePosts={handlePosts} />
                <Cities doubleFilter={doubleFilter} handlePosts={handlePosts} />
              </div>
            </Grid>
          )}
        </Grid>
      )}
      {!mediumView && (
        <Grid container justify='center' className={container}>
          <Grid item sm={3} lg={3} className={widget}>
            <div className='widget'>
              <div>
                <Cities doubleFilter={doubleFilter} handlePosts={handlePosts} />
              </div>
            </div>
          </Grid>
          <Grid style={{ height: '100vh', overflowY: 'auto' }} item sm={6} lg={6}>
            {middleColomn(`${t('dash.submit')}`)}
            {postItems()}
          </Grid>
          <Grid item sm={3} lg={3} className={widget}>
            <div className={classes.widget}>
              <Filters handlePosts={handlePosts} />
            </div>
          </Grid>
        </Grid>
      )}
    </div>
  )
}

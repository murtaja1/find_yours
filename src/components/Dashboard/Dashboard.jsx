import React, { useContext, useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Avatar, IconButton } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import LinearProgress from "@material-ui/core/LinearProgress";
import Navbar from "../Navbar/Navbar";
import { useStyles } from "./styles.js";
import Post from "./Post/Post";
import Widget from "./Widgets/Widget";
import LastPosts from "./Widgets/LastPosts";
import Cities from "./Widgets/Cities";
import Filters from "./Widgets/Filters";
import { useStyleDashboard } from "./Widgets/Style";
import { ProfileContext } from "../../profileContext";
import { db } from "../../firebase";
import Popover from "@material-ui/core/Popover";
import FilterListIcon from "@material-ui/icons/FilterList";

export default function Dashboard() {
  const [profile] = useContext(ProfileContext);
  const [posts, setPosts] = useState();
  const [isLoading] = useState(false);
  const [doubleFilter, setDubleFilter] = React.useState({});
  const mobileView = useMediaQuery("(max-width: 812px)");
  const mediumView = useMediaQuery("(max-width: 1210px)");
  const classes = useStyles();
  const handlePosts = (filterState) => {
    // to handle both the filters and cities queries.
    if (filterState.city === true) {
      const { province } = filterState;
      setDubleFilter({ ...doubleFilter, province });
    } else if (filterState.province != undefined) {
      const { color, category, Status, province } = filterState;
      setDubleFilter({ ...doubleFilter, color, category, Status, province });
    } else {
      const { color, category, Status } = filterState;
      setDubleFilter({ ...doubleFilter, color, category, Status });
    }
  };

  useEffect(() => {
    const query = db.collection("posts");
    const categoryQuery = doubleFilter.category
      ? query.where("category ", "==", doubleFilter["category"])
      : query;
    const colorQuery = doubleFilter.color
      ? categoryQuery.where("color", "==", doubleFilter["color"])
      : categoryQuery;
    const provinceQuery = doubleFilter.province
      ? colorQuery.where("province", "==", doubleFilter["province"])
      : colorQuery;
    const check = doubleFilter["Status"] === "true" ? true : false;
    const isLostQuery = doubleFilter.Status
      ? provinceQuery.where("isLost", "==", check)
      : provinceQuery;
    const res = [];
    isLostQuery.get().then((snapshot) => {
      // docs = all posts
      snapshot.docs.map((doc) => res.push(doc.data()));
      setPosts(res);
    });
  }, [doubleFilter]);
  const { container, searchfield, button, widget } = useStyleDashboard();
  const middleColomn = (text) => {
    return (
      <div style={{ margin: "0 20px" }}>
        <div className={classes.messageSender}>
          <div className={classes.messageSender_top}>
            <Avatar src={profile.imageUrl} />
            <div className={classes.searchbar}>
              <SearchBar
                className={searchfield}
                // Resource: https://codesandbox.io/s/mz7nx9v02j?file=/src/appStore.js
                // onRequestSearch={fetch}
                placeholder="Search items ..."
                autoFocus
              />
              {isLoading && <LinearProgress />}
            </div>
            {mobileView && (
              <div>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <FilterListIcon />
                </IconButton>

                <Popover
                  id={id}
                  open={open}
                  className={classes.pop}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <Filters handlePosts={handlePosts} />
                </Popover>
              </div>
            )}
            <div className={classes.buttons}>
              <Button
                {...{
                  className: button,
                }}
                variant="contained"
                color="primary"
                disableElevation
              >
                {text}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const postItems = () => {
    return (
      <div className={classes.posts}>
        {posts ? (
          posts.map((post) => <Post post={post} />)
        ) : (
          <CircularProgress />
        )}
      </div>
    );
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : "simple-popover";
  return (
    <div>
      <Navbar />
      {mediumView && (
        <Grid container justify="center" className={container}>
          <Grid item xs={12} sm={8} lg={8}>
            {middleColomn("Post")}

            {postItems()}
          </Grid>
          {!mobileView && (
            <Grid item sm={4} lg={4} className={widget}>
              <div className={classes.widget}>
                <Filters handlePosts={handlePosts} />
                <Cities handlePosts={handlePosts} />
              </div>
            </Grid>
          )}
        </Grid>
      )}
      {!mediumView && (
        <Grid container justify="center" className={container}>
          <Grid item sm={3} lg={3} className={widget}>
            <div className={classes.widget}>
              <div>
                <Widget />
                <LastPosts />
              </div>
            </div>
          </Grid>
          <Grid item sm={6} lg={6}>
            {middleColomn("Submit item")}
            {postItems()}
          </Grid>
          <Grid item sm={3} lg={3} className={widget}>
            <div className={classes.widget}>
              <Filters handlePosts={handlePosts} />
              <Cities handlePosts={handlePosts} />
            </div>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

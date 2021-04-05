import { makeStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 335,
      marginBottom: "15px",
      borderRadius: "20px",
    },
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
      marginTop: "5px",
    },
    button: {
      marginLeft: "auto",
      color: "grey",
    },
    avatar: {
      backgroundColor: grey[500],
    },
    content: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    root1: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
    },
    gridList1: {
      flexWrap: "nowrap",
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: "translateZ(0)",
    },
    title1: {
      color: theme.palette.primary.light,
    },
    titleBar1: {
      background:
        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    },
    image: {
      width: "100% !important",
    },
    foundTag: {
      height: "auto",
      backgroundColor: "#3fb59d",
    },
    lostTag: {
      height: "auto",
      backgroundColor: "#f72b74",
    },
    tagIcon: {
      marginLeft: "0px",
    },
  }));

  export {useStyles}
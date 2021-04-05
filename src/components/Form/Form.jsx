import { Paper, Grid, Select, MenuItem } from "@material-ui/core"
import React, { useState } from "react"
import useStyles from "./Style"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import { db } from "../../firebase"
import DateFnsUtils from "@date-io/date-fns"
import "date-fns"
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers"

const Form = () => {
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  )

  const [itemLost, setItemLost] = useState("")
  const [color, setColor] = useState("")
  const [whereLost, setWhereLost] = useState("")
  const [firstName, setFirstName] = useState("")
  const [phone, setPhone] = useState("")
  const [image, setImage] = useState(null)
  const [more, setMore] = useState("")
  const [email, setEmail] = useState("")
  const [lastName, setLastName] = useState("")
  const [category, setCategory] = React.useState("")

  const classes = useStyles()

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const handleChangeCat = (event) => {
    setCategory(event.target.value)
  }
  const handleChangeLoc = (event) => {
    setWhereLost(event.target.value)
  }

  const handleChangeCol = (event) => {
    setColor(event.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    db.collection("itemLost")
      .add({
        itemLost: itemLost,
        category: category,
        color: color,
        whereLost: whereLost,
        firstName: firstName,
        phone: phone,
        selectedDate: selectedDate,
        image: image,
        more: more,
        email: email,
        lastName: lastName,
      })

      .then(() => {
        alert("Submited")
      })

      .catch((error) => {
        alert(error.message)
      })

    setItemLost("")
    setColor("")
    setWhereLost("")
    setFirstName("")
    setPhone("")
    setSelectedDate("")
    setImage(null)
    setMore("")
    setEmail("")
    setLastName("")
    setCategory("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Paper className={classes.paper}>
              <h4 className={classes.title}>Item lost</h4>
              <p className={classes.desc}>
                (Dog, Jacket, Smartphone, Wallet, etc.) This field may
                auto-populate
              </p>
              <TextField
                id="outlined-basic"
                label="Item Lost"
                variant="outlined"
                size="large"
                className={classes.input}
                value={itemLost}
                onChange={(e) => setItemLost(e.target.value)}
                required
              />
              <h4 className={classes.title}>Category</h4>
              <p className={classes.desc}>
                (Animals/Pets, Clothing, Electronics, Personal Accessories etc.)
                This field is required.
              </p>

              <Select
                className={classes.input}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                onChange={handleChangeCat}
                onInputChange={(e) => setCategory(e.target.value)}
                required
              >
                <MenuItem value={10}>Wallets</MenuItem>
                <MenuItem value={20}>Documents</MenuItem>
                <MenuItem value={30}>Others</MenuItem>
              </Select>
              <h4 className={classes.title}>Color</h4>
              <p className={classes.desc}>
                Please add the color that best represents the lost property
                (Black, Red, Blue, etc.)
              </p>
              <Select
                className={classes.input}
                labelId="color"
                id="demo-simple-select"
                value={color}
                onChange={handleChangeCol}
                onInputChange={(e) => setColor(e.target.value)}
                required
              >
                <MenuItem value="black">Black</MenuItem>
                <MenuItem value="white">White</MenuItem>
                <MenuItem value="red">Red</MenuItem>
                <MenuItem value="green">Green</MenuItem>
                <MenuItem value="yellow">Yellow</MenuItem>
                <MenuItem value="blue">Blue</MenuItem>
                <MenuItem value="pink">Pink</MenuItem>
                <MenuItem value="gray">Gray</MenuItem>
                <MenuItem value="brown">Brown</MenuItem>
                <MenuItem value="orange">Orange</MenuItem>
                <MenuItem value="purple">Purple</MenuItem>
              </Select>
              <h4 className={classes.title}>Where Lost</h4>
              <p className={classes.desc}>
                Please provide an approximate location of the lost property
                (Bar, Restaurant, Park, etc.)
              </p>
              <Select
                className={classes.input}
                labelId="Provinces"
                id="demo-simple-select"
                value={whereLost}
                onChange={handleChangeLoc}
                onInputChange={(e) => setWhereLost(e.target.value)}
                required
              >
                <MenuItem value="Al Anbar">Al Anbar </MenuItem>
                <MenuItem value="Al-Qādisiyyah">Al-Qādisiyyah</MenuItem>
                <MenuItem value="Babil">Babil</MenuItem>
                <MenuItem value="Baghdad">Baghdad</MenuItem>
                <MenuItem value="Basra">Basra</MenuItem>
                <MenuItem value="Dhi Qar">Dhi Qar</MenuItem>
                <MenuItem value="Diyala">Diyala</MenuItem>
                <MenuItem value="Duhok">Duhok</MenuItem>
                <MenuItem value="Erbil">Erbil</MenuItem>
                <MenuItem value="Halabja">Halabja</MenuItem>
                <MenuItem value="Karbala">Karbala</MenuItem>
                <MenuItem value="Kirkuk">Kirkuk</MenuItem>
                <MenuItem value="Maysan">Maysan</MenuItem>
                <MenuItem value="Muthanna">Muthanna</MenuItem>
                <MenuItem value="Najaf">Najaf</MenuItem>
                <MenuItem value="Nineveh">Nineveh</MenuItem>
                <MenuItem value="Saladin">Saladin </MenuItem>
                <MenuItem value="Sulaymaniyah">Sulaymaniyah</MenuItem>
                <MenuItem value="Wasit">Wasit</MenuItem>
              </Select>
              <h2 className={classes.contact}>Contact Information.</h2>

              <h4 className={classes.title}>First Name</h4>
              <p className={classes.desc}>
                Please enter your first name(This will appear on your
                submission)
              </p>
              <TextField
                id="outlined-basic"
                label="First Name"
                variant="outlined"
                size="large"
                className={classes.input}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <h4 className={classes.title}>Phone Number</h4>
              <p className={classes.desc}>
                Please enter the phone number to display on your submission
              </p>
              <TextField
                id="outlined-basic"
                label="Phone Number"
                variant="outlined"
                size="large"
                className={classes.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                type="number"
              />
            </Paper>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Paper className={classes.paper}>
              <h4 className={classes.title}>Date lost</h4>
              <p className={classes.desc}>
                Please add the approximate date of when the item was lost.
              </p>

              <TextField
                id="date"
                label="Date"
                type="date"
                defaultValue="2017-05-24"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={classes.input}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />

              <h4 className={classes.title}>Time Lost</h4>
              <p className={classes.desc}>
                Please add the approximate time of day the item was lost.
              </p>

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker
                  className={classes.input}
                  margin="normal"
                  id="time-picker"
                  label="Time picker"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change time",
                  }}
                  required
                />
              </MuiPickersUtilsProvider>

              <h4 className={classes.title}>Image</h4>
              <p className={classes.desc}>
                (This image will display on the website.)
              </p>
              <input
                accept="image/*"
                className={classes.inputImg}
                id="contained-button-file"
                multiple
                type="file"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <label htmlFor="contained-button-file">
                <Button
                  variant="contained"
                  component="span"
                  className={classes.upload}
                >
                  Upload
                </Button>
              </label>
              <input
                accept="image/*"
                className={classes.inputImg}
                id="icon-button-file"
                type="file"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />

              <h4 className={classes.title}>Additional Information</h4>
              <p className={classes.desc}>
                Please provide any additional details/description of your lost
                property.
              </p>
              <TextField
                id="outlined-basic"
                label="Additional Information"
                variant="outlined"
                size="large"
                className={classes.input}
                value={more}
                onChange={(e) => setMore(e.target.value)}
              />
              <h4
                className={classes.title}
                style={{
                  marginTop: "6.3rem",
                }}
              >
                Last Name
              </h4>
              <p className={classes.desc}>
                Please enter your last name(This will appear on your submission)
              </p>
              <TextField
                id="outlined-basic"
                label="Last Name"
                variant="outlined"
                size="large"
                className={classes.input}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <h4 className={classes.title}>Email</h4>
              <p className={classes.desc}>
                Please enter the email to display on your submission
              </p>
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                size="large"
                className={classes.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Paper>
          </Grid>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: "1vh" }}
          >
            <Grid item xs={3}>
              <Button
                variant="contained"
                size="large"
                className={classes.button}
                color="primary"
                type="submit"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </form>
  )
}

export default Form
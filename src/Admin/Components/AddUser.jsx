import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import { MdOutlineCancel, MdPersonAddAlt1 } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Transition } from '../../Constants/Constant';

const AddUser = ({ getUser }) => {
    const [open, setOpen] = useState(false);
    const [credentials, setCredentials] = useState({ firstName: "", lastName: '', email: "", phoneNumber: '', password: "" });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, firstName, lastName, phoneNumber, password } = credentials;
        const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/gm;
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        try {
            if (!email || !firstName || !lastName || !phoneNumber || !password) {
                toast.error("Please Fill in all Fields", { autoClose: 500, theme: 'colored' });
            } else if (firstName.length <= 3 || lastName.length <= 3) {
                toast.error("Please enter a name with more than 3 characters", { autoClose: 500, theme: 'colored' });
            } else if (!emailRegex.test(email)) {
                toast.error("Please enter a valid email", { autoClose: 500, theme: 'colored' });
            } else if (!phoneRegex.test(phoneNumber)) {
                toast.error("Please enter a valid phone number", { autoClose: 500, theme: 'colored' });
            } else if (password.length < 5) {
                toast.error("Please enter a password with more than 5 characters", { autoClose: 500, theme: 'colored' });
            } else {
                const sendAuth = await axios.post(`${process.env.REACT_APP_REGISTER}`, {
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    password,
                });

                const receive = await sendAuth.data;
                setOpen(false);
                if (receive.success === true) {
                    getUser();
                    toast.success("Registered Successfully", { autoClose: 500, theme: 'colored' });
                    setCredentials({ firstName: "", lastName: '', email: "", phoneNumber: '', password: "" });
                } else {
                    toast.error("Something went wrong", { autoClose: 500, theme: 'colored' });
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "An error occurred", { autoClose: 500, theme: 'colored' });
        }
    }

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: "20px 0" }} >
                <Typography variant='h6' textAlign='center' color="#1976d2" fontWeight="bold">Add new user</Typography>
                <Button variant='contained' endIcon={<MdPersonAddAlt1 />} onClick={handleClickOpen}>Add</Button>
            </Box>
            <Divider sx={{ mb: 5 }} />
            <Dialog open={open} onClose={handleClose} keepMounted TransitionComponent={Transition}>
                <DialogTitle sx={{ textAlign: "center", fontWeight: 'bold', color: "#1976d2" }}> Add new user</DialogTitle>
                <DialogContent>
                    <Box onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField autoComplete="given-name" name="firstName" value={credentials.firstName} onChange={handleOnChange} required fullWidth id="firstName" label="First Name" autoFocus />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required fullWidth id="lastName" label="Last Name" name="lastName" value={credentials.lastName} onChange={handleOnChange} autoComplete="family-name" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth id="email" label="Email Address" name="email" value={credentials.email} onChange={handleOnChange} autoComplete="email" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth id="phoneNumber" label="Contact Number" name="phoneNumber" value={credentials.phoneNumber} onChange={handleOnChange} inputMode='numeric' />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth name="password" label="Password" type="password" value={credentials.password} onChange={handleOnChange} id="password" autoComplete="new-password" />
                            </Grid>
                        </Grid>
                        <DialogActions sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: 2 }}>
                            <Button fullWidth variant='contained' color='error' onClick={handleClose} endIcon={<MdOutlineCancel />}>Cancel</Button>
                            <Button type="submit" onClick={handleSubmit} fullWidth variant="contained" endIcon={<MdPersonAddAlt1 />}>Add</Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddUser;

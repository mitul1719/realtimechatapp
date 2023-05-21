import React, { useState } from 'react'
import { FormControl, Input, Stack, Tab, TabPanel, TabPanels, Tabs, TabList, Button, InputGroup, InputLeftAddon, useToast } from '@chakra-ui/react'
import './styles.css'

const Login = () => {
    const [loading, setLoading] = useState(false)
    const [picUrl, setPicUrl] = useState()
    const [picFile, setPicFile] = useState()
    const [signDetails, setSignDetails] = useState({})
    const [loginDetails, setLoginDetails] = useState({})
    const toast = useToast()

    const handleSubmit = (context) => {
        switch (context) {
            case 'signup':
                console.log(signDetails)
                const { name, email: Email, password: Password, confirm } = signDetails
                if (!name || !Email || !Password) {
                    toast({
                        title: 'Enter all fields',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                        position: 'bottom',
                    })
                    return
                }

                if (Password !== confirm) {
                    toast({
                        title: 'Passwords dont match',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                        position: 'bottom',
                    })
                    return
                }

                const payLoad = {
                    name,
                    email: Email,
                    password: Password,
                }

                // fetch("http://localhost:1337/api/user/register", {
                //   method: "POST",
                //   body: JSON.stringify(payLoad),
                //   headers: {
                //     Accept: "application/json",
                //     "Content-Type": "application/json",
                //   },
                // })
                //   .then((res) => res.json())
                //   .then(console.log);

                signInAndUploadPic(payLoad)
                break
                return
            case 'login':
                console.log(loginDetails)
                const { email, password } = loginDetails
                if (!email || !password) {
                    toast({
                        title: 'Enter all fields',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                        position: 'bottom',
                    })
                    return
                }

                fetch('http://localhost:1337/api/user/login', {
                    method: 'POST',
                    body: { email, password },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.stack) {
                            toast({
                                title: data.message,
                                status: 'error',
                                duration: 5000,
                                isClosable: true,
                                position: 'bottom',
                            })
                        } else {
                            toast({
                                title: successful,
                                status: 'error',
                                duration: 5000,
                                isClosable: true,
                                position: 'bottom',
                            })
                        }
                    })
                    .catch((err) => {
                        toast({
                            title: err.message,
                            status: 'error',
                            duration: 5000,
                            isClosable: true,
                            position: 'bottom',
                        })
                    })
                break
                return
        }
    }

    const signInAndUploadPic = async (payLoad) => {
        setLoading(true)
        if (picFile === undefined) {
            toast({
                title: 'Please select an Image',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false)
            return
        }
        if (picFile.type === 'image/jpeg' || picFile.type === 'image/png') {
            const data = new FormData()
            data.append('file', picFile)
            data.append('upload_preset', 'chatapp')
            data.append('cloud_name', 'dfkwfhuru')

            const stream = await fetch('https://api.cloudinary.com/v1_1/dfkwfhuru/image/upload', {
                method: 'POST',
                body: data,
            })

            await stream
                .json()
                .then((data) => {
                    // toast({
                    //   title: "Image Upload Successful",
                    //   status: "success",
                    //   duration: 5000,
                    //   isClosable: true,
                    //   position: "bottom",
                    // });
                    setPicUrl(data.url.toString())

                    payLoad.pic = data.url.toString()

                    fetch('http://localhost:1337/api/user/register', {
                        method: 'POST',
                        body: JSON.stringify(payLoad),
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            toast({
                                title: 'User registered successfully',
                                status: 'success',
                                duration: 5000,
                                isClosable: true,
                                position: 'bottom',
                            })
                        })

                    setLoading(false)
                })
                .catch((err) => {
                    toast({
                        title: 'Something went wrong',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                        position: 'bottom',
                    })
                    setLoading(false)
                })
        } else {
            toast({
                title: 'Please upload jpeg/png',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false)
        }
    }
    return (
        <main>
            <Tabs>
                <TabList className="tab">
                    <Tab>Login</Tab>
                    <Tab>Sign-Up</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <FormControl>
                            <Stack spacing={3}>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    onChange={(e) =>
                                        setLoginDetails((details) => ({
                                            ...details,
                                            [e.target.name]: e.target.value,
                                        }))
                                    }
                                />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    onChange={(e) =>
                                        setLoginDetails((details) => ({
                                            ...details,
                                            [e.target.name]: e.target.value,
                                        }))
                                    }
                                />
                                <Button colorScheme="teal" variant="outline" type="submit" onClick={() => handleSubmit('login')}>
                                    Log Me In!
                                </Button>
                            </Stack>
                        </FormControl>
                    </TabPanel>
                    <TabPanel>
                        <FormControl>
                            <Stack spacing={3}>
                                <Input
                                    type="text"
                                    placeholder="Name"
                                    name="name"
                                    onChange={(e) =>
                                        setSignDetails((details) => ({
                                            ...details,
                                            [e.target.name]: e.target.value,
                                        }))
                                    }
                                />

                                <Input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    onChange={(e) =>
                                        setSignDetails((details) => ({
                                            ...details,
                                            [e.target.name]: e.target.value,
                                        }))
                                    }
                                />

                                <Input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    onChange={(e) =>
                                        setSignDetails((details) => ({
                                            ...details,
                                            [e.target.name]: e.target.value,
                                        }))
                                    }
                                />
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    name="confirm"
                                    onChange={(e) =>
                                        setSignDetails((details) => ({
                                            ...details,
                                            [e.target.name]: e.target.value,
                                        }))
                                    }
                                />

                                <InputGroup className="group">
                                    <InputLeftAddon children="Display Pic" />
                                    <Input type="file" p="1.5" accept="image/*" onChange={(e) => setPicFile(e.target.files[0])} />
                                </InputGroup>

                                <Button colorScheme="teal" variant="outline" type="submit" onClick={() => handleSubmit('signup')} isLoading={loading}>
                                    Go!
                                </Button>
                            </Stack>
                        </FormControl>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </main>
    )
}

export default Login

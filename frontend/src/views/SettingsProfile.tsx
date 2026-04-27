import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import Upload from '@/components/ui/Upload'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import { Form, FormItem } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { HiOutlineUser } from 'react-icons/hi'
import { TbPlus } from 'react-icons/tb'
import useSWR from 'swr'
import {
    getProfile,
    updateProfile,
} from '@/services/ProfileService'

type FormType = {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    img: string
    country: string
    address: string
    city: string
    postcode: string
}

const SettingsProfile =
    () => {
        const {
            handleSubmit,
            reset,
            control,
            formState: {
                isSubmitting,
            },
        } =
            useForm<FormType>()

        const {
            data,
            mutate,
        } = useSWR(
            'profile',
            async () => {
                const res =
                    await getProfile()
                return res.data
            },
        )

        useEffect(() => {
            if (data) {
                const names =
                    data.name
                        ?.split(
                            ' ',
                        ) || []

                reset({
                    firstName:
                        names[0] ||
                        '',
                    lastName:
                        names[1] ||
                        '',
                    email:
                        data.email ||
                        '',
                    phoneNumber:
                        data.phone ||
                        '',
                    img:
                        data.avatar ||
                        '',
                    country:
                        data.country ||
                        '',
                    address:
                        data.address ||
                        '',
                    city:
                        data.city ||
                        '',
                    postcode:
                        data.postcode ||
                        '',
                })
            }
        }, [
            data,
            reset,
        ])

        const onSubmit =
            async (
                values: FormType,
            ) => {
                const payload =
                    {
                        name:
                            values.firstName +
                            ' ' +
                            values.lastName,
                        email:
                            values.email,
                        phone:
                            values.phoneNumber,
                        avatar:
                            values.img,
                        country:
                            values.country,
                        address:
                            values.address,
                        city:
                            values.city,
                        postcode:
                            values.postcode,
                    }

                const res =
                    await updateProfile(
                        payload,
                    )

                mutate(
                    res.data,
                    false,
                )

                alert(
                    'Profile updated successfully',
                )
            }

        return (
            <Card className="p-6">
                <div className="mb-8">
                    <h4 className="mb-1">
                        Personal Information
                    </h4>

                    <p className="text-gray-500">
                        Update your account details
                    </p>
                </div>

                <Form
                    onSubmit={handleSubmit(
                        onSubmit,
                    )}
                >
                    <div className="mb-8 flex flex-col md:flex-row md:items-center gap-5 border-b pb-6">
                        <Controller
                            name="img"
                            control={
                                control
                            }
                            render={({
                                field,
                            }) => (
                                <>
                                    <Avatar
                                        size={
                                            90
                                        }
                                        className="border-4 border-white shadow-md bg-gray-100 text-gray-400"
                                        src={
                                            field.value
                                        }
                                        icon={
                                            <HiOutlineUser />
                                        }
                                    />

                                    <div className="flex gap-2">
                                        <Upload
                                            showList={
                                                false
                                            }
                                            uploadLimit={
                                                1
                                            }
                                            onChange={(
                                                files,
                                            ) => {
                                                if (
                                                    files.length >
                                                    0
                                                ) {
                                                    field.onChange(
                                                        URL.createObjectURL(
                                                            files[0],
                                                        ),
                                                    )
                                                }
                                            }}
                                        >
                                            <Button
                                                size="sm"
                                                type="button"
                                                variant="solid"
                                                icon={
                                                    <TbPlus />
                                                }
                                            >
                                                Upload
                                            </Button>
                                        </Upload>

                                        <Button
                                            size="sm"
                                            type="button"
                                            onClick={() =>
                                                field.onChange(
                                                    '',
                                                )
                                            }
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </>
                            )}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <FormItem label="First Name">
                            <Controller
                                name="firstName"
                                control={
                                    control
                                }
                                render={({
                                    field,
                                }) => (
                                    <Input
                                        {...field}
                                        size="lg"
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Last Name">
                            <Controller
                                name="lastName"
                                control={
                                    control
                                }
                                render={({
                                    field,
                                }) => (
                                    <Input
                                        {...field}
                                        size="lg"
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Email">
                            <Controller
                                name="email"
                                control={
                                    control
                                }
                                render={({
                                    field,
                                }) => (
                                    <Input
                                        {...field}
                                        size="lg"
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Phone">
                            <Controller
                                name="phoneNumber"
                                control={
                                    control
                                }
                                render={({
                                    field,
                                }) => (
                                    <Input
                                        {...field}
                                        size="lg"
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Country">
                            <Controller
                                name="country"
                                control={
                                    control
                                }
                                render={({
                                    field,
                                }) => (
                                    <Input
                                        {...field}
                                        size="lg"
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="City">
                            <Controller
                                name="city"
                                control={
                                    control
                                }
                                render={({
                                    field,
                                }) => (
                                    <Input
                                        {...field}
                                        size="lg"
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <FormItem label="Address">
                        <Controller
                            name="address"
                            control={
                                control
                            }
                            render={({
                                field,
                            }) => (
                                <Input
                                    {...field}
                                    size="lg"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem label="Postcode">
                        <Controller
                            name="postcode"
                            control={
                                control
                            }
                            render={({
                                field,
                            }) => (
                                <Input
                                    {...field}
                                    size="lg"
                                />
                            )}
                        />
                    </FormItem>

                    <div className="flex justify-end mt-6">
                        <Button
                            type="submit"
                            variant="solid"
                            loading={
                                isSubmitting
                            }
                        >
                            Save Changes
                        </Button>
                    </div>
                </Form>
            </Card>
        )
    }

export default SettingsProfile
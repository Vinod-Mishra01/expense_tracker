import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import Upload from '@/components/ui/Upload'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
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
                reset({
                    firstName:
                        data.name
                            ?.split(
                                ' ',
                            )[0] ||
                        '',
                    lastName:
                        data.name
                            ?.split(
                                ' ',
                            )[1] ||
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
            }

        return (
            <>
                <h4 className="mb-8">
                    Personal
                    Information
                </h4>

                <Form
                    onSubmit={handleSubmit(
                        onSubmit,
                    )}
                >
                    <div className="mb-8">
                        <Controller
                            name="img"
                            control={
                                control
                            }
                            render={({
                                field,
                            }) => (
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        size={
                                            90
                                        }
                                        className="border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                                        icon={
                                            <HiOutlineUser />
                                        }
                                        src={
                                            field.value
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
                                                variant="solid"
                                                size="sm"
                                                type="button"
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
                                </div>
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
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

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
                                />
                            )}
                        />
                    </FormItem>

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
                                />
                            )}
                        />
                    </FormItem>

                    <div className="grid md:grid-cols-2 gap-4">
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
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button
                            variant="solid"
                            type="submit"
                            loading={
                                isSubmitting
                            }
                        >
                            Save
                        </Button>
                    </div>
                </Form>
            </>
        )
    }

export default SettingsProfile
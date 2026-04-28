import { useEffect, useState } from 'react'
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
import { useSessionUser } from '@/store/authStore'

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

const SettingsProfile = () => {
    const [editMode, setEditMode] =
        useState(false)

    const { setUser } =
        useSessionUser()

    const {
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        formState: {
            isSubmitting,
        },
    } = useForm<FormType>()

    const { data, mutate } =
        useSWR(
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
                data.name?.split(
                    ' ',
                ) || []

            reset({
                firstName:
                    names[0] || '',
                lastName:
                    names[1] || '',
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
    }, [data, reset])

    const onSubmit =
        async (
            values: FormType,
        ) => {
            const payload = {
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

            setUser({
                avatar:
                    values.img,
                userName:
                    payload.name,
                email:
                    payload.email,
            })

            alert(
                'Profile Updated Successfully',
            )

            setEditMode(
                false,
            )
        }

    const profileImg =
        watch('img') || ''

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h4>
                        Personal Information
                    </h4>

                    <p className="text-gray-500">
                        Manage
                        your
                        account
                        details
                    </p>
                </div>

                {!editMode && (
                    <Button
                        variant="solid"
                        onClick={() =>
                            setEditMode(
                                true,
                            )
                        }
                    >
                        Edit
                        Profile
                    </Button>
                )}
            </div>

            {/* VIEW MODE */}

            {!editMode &&
                data && (
                    <div className="space-y-5">
                        <div className="flex gap-4 items-center border-b pb-5">
                            <Avatar
                                size={
                                    90
                                }
                                src={
                                    data.avatar
                                }
                                icon={
                                    <HiOutlineUser />
                                }
                            />

                            <div>
                                <h5>
                                    {
                                        data.name
                                    }
                                </h5>

                                <p>
                                    {
                                        data.email
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <b>
                                    Phone:
                                </b>{' '}
                                {data.phone ||
                                    '-'}
                            </div>

                            <div>
                                <b>
                                    Country:
                                </b>{' '}
                                {data.country ||
                                    '-'}
                            </div>

                            <div>
                                <b>
                                    City:
                                </b>{' '}
                                {data.city ||
                                    '-'}
                            </div>

                            <div>
                                <b>
                                    Postcode:
                                </b>{' '}
                                {data.postcode ||
                                    '-'}
                            </div>
                        </div>

                        <div>
                            <b>
                                Address:
                            </b>{' '}
                            {data.address ||
                                '-'}
                        </div>
                    </div>
                )}

            {/* EDIT MODE */}

            {editMode && (
                <Form
                    onSubmit={handleSubmit(
                        onSubmit,
                    )}
                >
                    <div className="flex gap-4 items-center border-b pb-5 mb-6">
                        <Avatar
                            size={
                                90
                            }
                            src={
                                profileImg
                            }
                            icon={
                                <HiOutlineUser />
                            }
                        />

                        <Controller
                            name="img"
                            control={
                                control
                            }
                            render={() => (
                                <Upload
                                    showList={
                                        false
                                    }
                                    uploadLimit={
                                        1
                                    }
                                    onChange={(
                                        files: any,
                                    ) => {
                                        const file =
                                            files?.[0]
                                                ?.file ||
                                            files?.[0]

                                        if (
                                            !file
                                        )
                                            return

                                        const maxSize =
                                            3 *
                                            1024 *
                                            1024

                                        if (
                                            file.size >
                                            maxSize
                                        ) {
                                            alert(
                                                'Image too large. Please upload under 3MB.',
                                            )
                                            return
                                        }

                                        const reader =
                                            new FileReader()

                                        reader.onload =
                                            (
                                                e,
                                            ) => {
                                                setValue(
                                                    'img',
                                                    e
                                                        .target
                                                        ?.result as string,
                                                    {
                                                        shouldDirty: true,
                                                    },
                                                )
                                            }

                                        reader.readAsDataURL(
                                            file,
                                        )
                                    }}
                                >
                                    <Button
                                        type="button"
                                        icon={
                                            <TbPlus />
                                        }
                                    >
                                        Upload
                                    </Button>
                                </Upload>
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

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            onClick={() =>
                                setEditMode(
                                    false,
                                )
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="solid"
                            loading={
                                isSubmitting
                            }
                        >
                            Save
                            Changes
                        </Button>
                    </div>
                </Form>
            )}
        </Card>
    )
}

export default SettingsProfile
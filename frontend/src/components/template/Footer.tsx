import Container from '@/components/shared/Container'
import classNames from '@/utils/classNames'
import { APP_NAME } from '@/constants/app.constant'
import { PAGE_CONTAINER_GUTTER_X } from '@/constants/theme.constant'

export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
    pageContainerType: FooterPageContainerType
    className?: string
}

const FooterContent = () => {
    return (
        // <div className="flex items-center justify-between flex-auto w-full">
        //     <span>
        //         Copyright &copy; {`${new Date().getFullYear()}`}{' '}
        //         <span className="font-semibold">{`${APP_NAME}`}</span> All
        //         rights reserved.
        //     </span>
        //     <div className="">
        //         <a
        //             className="text-gray"
        //             href="/#"
        //             onClick={(e) => e.preventDefault()}
        //         >
        //             Term & Conditions
        //         </a>
        //         <span className="mx-2 text-muted"> | </span>
        //         <a
        //             className="text-gray"
        //             href="/#"
        //             onClick={(e) => e.preventDefault()}
        //         >
        //             Privacy & Policy
        //         </a>
        //     </div>
        // </div>



<div className="flex flex-col md:flex-row items-center justify-between gap-3 flex-auto w-full">

    <span className="text-sm text-gray-500 text-center md:text-left">
        Copyright &copy; {new Date().getFullYear()}{' '}

        <a
            href="https://vinodm.great-site.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
        >
            VM Tech
        </a>{' '}

        All rights reserved.
    </span>

    <div className="flex items-center gap-2 text-sm text-center">
        <span className="text-gray-500">
            Developed by
        </span>

        <a
            href="https://vinodm.great-site.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
        >
            Vinod Mishra
        </a>
    </div>

</div>

    )
}

export default function Footer({
    pageContainerType = 'contained',
    className,
}: FooterProps) {
    return (
        <footer
            className={classNames(
                `footer flex flex-auto items-center h-16 ${PAGE_CONTAINER_GUTTER_X}`,
                className,
            )}
        >
            {pageContainerType === 'contained' ? (
                <Container>
                    <FooterContent />
                </Container>
            ) : (
                <FooterContent />
            )}
        </footer>
    )
}

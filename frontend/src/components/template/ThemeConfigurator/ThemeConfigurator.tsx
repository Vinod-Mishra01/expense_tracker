import ModeSwitcher from './ModeSwitcher'
import ThemeSwitcher from './ThemeSwitcher'

const ThemeConfigurator = () => {
    return (
        <div className="flex flex-col h-full justify-between p-4">
            <div className="flex flex-col gap-y-10">

                <div className="flex items-center justify-between">
                    <div>
                        <h6>Dark Mode</h6>
                        <span>Switch theme to dark mode</span>
                    </div>
                    <ModeSwitcher />
                </div>

                <div>
                    <h6 className="mb-3">Theme Color</h6>
                    <ThemeSwitcher />
                </div>

            </div>
        </div>
    )
}

export default ThemeConfigurator
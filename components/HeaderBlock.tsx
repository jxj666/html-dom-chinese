/*
 * @LastEditTime: 2022-08-25 17:45:57
 * @LastEditors: jinxiaojian
 */
import Link from 'next/link';
import * as React from 'react';
import { Logo } from '@1milligram/design';

export const HeaderBlock = () => {
    const [totalStars, setTotalStars] = React.useState(0);

    React.useEffect(() => {
        fetch('https://api.github.com/repos/1milligram/html-dom')
            .then((res) => res.json())
            .then((data) => setTotalStars(data.stargazers_count))
            .catch(console.log);
    }, []);

    const HeaderLogo = React.forwardRef<HTMLAnchorElement, React.LinkHTMLAttributes<HTMLAnchorElement>>(
        (props, ref) => (
            <a href={props.href} onClick={props.onClick} ref={ref}>
                <Logo brand="HTML DOM" />
            </a>
        )
    );

    return (
        <header className="block-header">
            <div className="block-container">
                <div className="block-header__inner">
                    <Link href="/" passHref>
                        <HeaderLogo />
                    </Link>
                    <Link href="https://github.com/1milligram/html-dom">
                        <a className="block-header__cta">原作者 GitHub {totalStars}★</a>
                    </Link>
                </div>
            </div>
        </header>
    );
};

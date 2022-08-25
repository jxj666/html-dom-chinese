/*
 * @LastEditTime: 2022-08-25 17:43:25
 * @LastEditors: jinxiaojian
 */
import * as React from 'react';
import { Footer, FooterGroup, FooterLink } from '@1milligram/design';

export const FooterBlock = () => (
    <footer className="block-footer">
        <div className="block-container">
            <Footer>
                <FooterGroup title="友情链接">
                    <FooterLink href="https://htmldom.dev/">HTML DOM</FooterLink>
                    <FooterLink href="https://github.com/jxj666">JXJ gitHub</FooterLink>
                </FooterGroup>
            </Footer>

            <div className="block-footer__copyright">
                © 2020 — {new Date().getFullYear()} 
            </div>
        </div>
    </footer>
);

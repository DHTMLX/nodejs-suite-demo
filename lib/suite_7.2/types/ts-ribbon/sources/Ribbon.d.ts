import { Navbar, IState, IBlock, INavbar, IButton, IInput, IImageButton, ISeparator, ISpacer, ITitle, ICustomHTML, ISelectButton, INavItem } from "../../ts-navbar";
import { Id } from "../../ts-common/types";
import { TreeCollection } from "../../ts-data";
export interface IToolbarConfig {
    css?: string;
    menuCss?: string;
    data?: any[] | TreeCollection<IRibbonElement>;
}
export interface IRibbon extends INavbar {
    config: IToolbarConfig;
    getState(): IState;
    setState(state: IState): void;
}
interface IRibbonButton extends IButton {
    size?: "small" | "medium" | "auto";
}
interface IRibbonImageButton extends IImageButton {
    size?: "small" | "medium" | "auto";
}
interface IRibbonSelectButton extends ISelectButton {
    size?: "small" | "medium" | "auto";
}
interface IRibbonNavItem extends INavItem {
    size?: "small" | "medium" | "auto";
}
export declare type IRibbonElement = IRibbonButton | IInput | IRibbonImageButton | ISeparator | ISpacer | ITitle | IRibbonSelectButton | ICustomHTML | IBlock | IRibbonNavItem;
export declare class Ribbon extends Navbar<IRibbonElement> implements IRibbon {
    private _listeners;
    constructor(element?: string | HTMLElement, config?: any);
    getState(): IState;
    setState(state: IState): void;
    protected _getFactory(): any;
    protected _getMode(item: any, root: any): "right" | "bottom";
    protected _close(e: MouseEvent): void;
    protected _draw(): any;
    protected _setRoot(id: Id): void;
    private _drawBlock;
}
export {};

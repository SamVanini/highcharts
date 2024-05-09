/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Pawel Lysy
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Component from '../Components/Component';
import type EditableOptions from '../Components/EditableOptions';
import type Globals from '../Globals';

import EditRenderer from './EditRenderer.js';
import U from '../../Core/Utilities.js';
import EditGlobals from './EditGlobals.js';
import ConfirmationPopup from './ConfirmationPopup.js';
const {
    createElement,
    merge,
    error
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Accordion menu class.
 */
class AccordionMenu {

    /* *
     *
     *  Constructor
     *
     * */

    constructor(iconsURLPrefix: string, closeSidebar: Function) {
        this.iconsURLPrefix = iconsURLPrefix;
        this.closeSidebar = closeSidebar;
    }

    /* *
     *
     *  Properties
     *
     * */

    private iconsURLPrefix: string;
    private closeSidebar: Function;
    private changedOptions: DeepPartial<Component.Options> = {};
    private chartOptionsJSON = {};
    private component?: Component;
    private oldOptionsBuffer: DeepPartial<Component.Options> = {};
    private confirmationPopup?: ConfirmationPopup;
    public waitingForConfirmation = false;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Renders the menu for given component.
     *
     * @param container
     * The HTML Element to render the menu in.
     * @param component
     * The component to render the menu for.
     */
    public renderContent(container: HTMLElement, component: Component): void {
        const { editMode } = component.board;
        const menu = this;
        const editableOptions = component.editableOptions.getOptions();
        let option, content;

        this.component = component;
        this.oldOptionsBuffer = merge({}, component.options);

        if (editMode) {
            this.confirmationPopup = new ConfirmationPopup(
                component.board.container,
                editMode.iconsURLPrefix,
                editMode,
                { close: { icon: '' } }
            );
        }

        const accordionContainer = createElement(
            'div',
            {
                className: EditGlobals.classNames.accordionMenu
            },
            {},
            container
        );

        for (let i = 0, end = editableOptions.length; i < end; i++) {
            option = editableOptions[i];
            content = EditRenderer.renderCollapseHeader(
                accordionContainer,
                {
                    name: option.name,
                    iconsURLPrefix: menu.iconsURLPrefix,
                    lang: (component.board?.editMode || EditGlobals).lang
                }
            ).content;

            this.renderAccordion(option, content, component);
        }

        const buttonContainer = createElement(
            'div',
            {
                className: EditGlobals.classNames.accordionMenuButtonsContainer
            },
            {},
            accordionContainer
        );

        EditRenderer.renderButton(
            buttonContainer,
            {
                text: (component.board?.editMode || EditGlobals)
                    .lang.confirmButton,
                className: EditGlobals.classNames.popupConfirmBtn,
                callback: async (): Promise<void> => {
                    if (Object.keys(this.chartOptionsJSON).length) {
                        await component.update({
                            chartOptions: this.chartOptionsJSON
                        } as any);
                    }

                    menu.changedOptions = {};
                    menu.chartOptionsJSON = {};
                    menu.closeSidebar();
                }
            }
        );

        EditRenderer.renderButton(
            buttonContainer,
            {
                text: (component.board?.editMode || EditGlobals)
                    .lang.cancelButton,
                className: EditGlobals.classNames.popupCancelBtn,
                callback: (): void => {
                    this.cancelChanges();
                }
            }
        );
    }

    /**
     * Update the options object with new nested value, based on the property
     * path. If the objects in the path are not defined, the function will
     * create them.
     *
     * @param propertyPath
     * Path of the property for which the value should be updated.
     * Example: ```['chartOptions', 'chart', 'type']```
     * @param value
     * New value of the property.
     */
    public updateOptions(
        propertyPath: Array<string>,
        value: boolean | string | number
    ): void {
        const pathLength = propertyPath.length - 1;

        let currentLevel = this.changedOptions as Globals.AnyRecord;
        let currentChartOptionsLevel;
        let currentOldChartOptionsBufferLevel;

        if (pathLength === 0 && propertyPath[0] === 'chartOptions') {
            try {
                const parsedValue = JSON.parse(value as string);
                this.chartOptionsJSON = parsedValue;
            } catch (e) {
                // TODO: Handle the wrong config passed from the user.
                error(
                    'Dashboards Error: Wrong JSON config structure passed as' +
                        ' a chart options.'
                );
            }
        }

        for (let i = 0; i < pathLength; i++) {
            const key = propertyPath[i];

            if (!currentLevel[key]) {
                currentLevel[key] = {};
            }

            currentLevel = currentLevel[key];

            if (key === 'chartOptions') {
                const realChartOptions = (this.component as any).chart?.options;

                if (realChartOptions) {
                    const oldOptionsBuffer =
                        this.oldOptionsBuffer as Globals.AnyRecord;
                    if (!oldOptionsBuffer.chartOptions) {
                        oldOptionsBuffer.chartOptions = {};
                    }
                    currentOldChartOptionsBufferLevel =
                        oldOptionsBuffer.chartOptions as Globals.AnyRecord;
                    currentChartOptionsLevel = realChartOptions;
                }
            } else if (
                currentChartOptionsLevel &&
                currentOldChartOptionsBufferLevel
            ) {
                currentChartOptionsLevel = currentChartOptionsLevel[key];

                if (currentOldChartOptionsBufferLevel[key] === void 0) {
                    currentOldChartOptionsBufferLevel[key] = {};
                }

                currentOldChartOptionsBufferLevel =
                    currentOldChartOptionsBufferLevel[key];
            }
        }

        const lastKey = propertyPath[pathLength];
        currentLevel[lastKey] = value;

        if (currentOldChartOptionsBufferLevel && currentChartOptionsLevel) {
            currentOldChartOptionsBufferLevel[lastKey] = (
                currentOldChartOptionsBufferLevel[lastKey] ??
                currentChartOptionsLevel[lastKey]
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.component?.update(
            this.changedOptions as Partial<Component.Options>
        );
    }

    /**
     * Renders either a basic or nested element. This function can be recursivly
     * called, if there are multiple nested options.
     *
     * @param options
     * Configuration object of the Component options.
     * @param parentNode
     * A container where the accordion is rendered.
     * @param component
     * the component for which the menu should be rendered.
     */
    public renderAccordion(
        options: EditableOptions.Options,
        parentNode: HTMLElement,
        component: Component
    ): void {

        if (options.type === 'nested') {
            return this.renderNested(parentNode, options, component);
        }

        const renderFunction = EditRenderer.getRendererFunction(options.type);

        if (!renderFunction) {
            return;
        }

        renderFunction(parentNode, {
            ...options,
            iconsURLPrefix: this.iconsURLPrefix,
            value: component.getEditableOptionValue(options.propertyPath),
            onchange: (
                value: boolean | string | number
            ): void => this.updateOptions(options.propertyPath || [], value)
        });

    }

    /**
     * Render nested menu for the component.
     *
     * @param parentElement
     * HTML element to which the nested structure should be rendered to
     * @param options
     * configuration object for the options
     * @param component
     * The component instance for the options should be rendered
     */
    public renderNested(
        parentElement: HTMLElement,
        options: EditableOptions.Options,
        component: Component
    ): void {
        if (!parentElement || !options.nestedOptions) {
            return;
        }

        const nestedOptions = options.nestedOptions;

        for (let i = 0, iEnd = nestedOptions.length; i < iEnd; ++i) {
            const name = nestedOptions[i].name;
            const accordionOptions = nestedOptions[i].options;
            const showToggle = !!nestedOptions[i].showToggle;
            const propertyPath = nestedOptions[i].propertyPath || [];
            const collapsedHeader = EditRenderer.renderCollapseHeader(
                parentElement, {
                    name,
                    isEnabled: !!component.getEditableOptionValue(propertyPath),
                    iconsURLPrefix: this.iconsURLPrefix,
                    showToggle: showToggle,
                    onchange: (value: boolean | string | number): void =>
                        this.updateOptions(propertyPath, value),
                    isNested: true,
                    lang: (component.board?.editMode || EditGlobals).lang
                }
            );

            for (let j = 0, jEnd = accordionOptions.length; j < jEnd; ++j) {
                this.renderAccordion(
                    accordionOptions[j] as EditableOptions.Options,
                    collapsedHeader.content,
                    component
                );
            }

        }
        return;
    }

    public cancelChanges(): void {
        if (Object.keys(this.changedOptions).length < 1) {
            this.closeSidebar();
        } else {
            this.showCancelConfirmationPopup();
        }
    }

    /**
     * Discards changes made in the menu.
     */
    private async discardChanges(): Promise<void> {
        await this.component?.update(
            this.oldOptionsBuffer as Partial<Component.Options>
        );

        this.changedOptions = {};
        this.chartOptionsJSON = {};
    }

    /**
     * Shows a confirmation popup when the user tries to discard changes.
     */
    private showCancelConfirmationPopup(): void {
        const popup = this.confirmationPopup;
        if (!popup || this.waitingForConfirmation) {
            return;
        }

        this.waitingForConfirmation = true;
        popup.show({
            text: 'Are you sure you want to discard changes?',
            confirmButton: {
                value: 'Yes',
                callback: async (): Promise<void> => {
                    await this.discardChanges();
                    this.waitingForConfirmation = false;
                    this.closeSidebar();
                },
                context: this as any
            },
            cancelButton: {
                value: 'No',
                callback: (): void => {
                    popup.closePopup();

                    setTimeout((): void => {
                        this.waitingForConfirmation = false;
                    }, 100);
                }
            }
        });
    }
}

/* *
 *
 *  Default Export
 *
 * */
export default AccordionMenu;

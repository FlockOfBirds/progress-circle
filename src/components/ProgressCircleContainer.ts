import { CSSProperties, Component, createElement } from "react";
import { BootstrapStyle, ProgressCircle, ProgressTextSize } from "./ProgressCircle";

interface WrapperProps {
    class: string;
    style: CSSProperties;
}

export interface ContainerProps extends WrapperProps {
    animate: PluginWidget.EditableValue<boolean>;
    circleThickness: PluginWidget.DynamicValue<number>;
    displayText: DisplayText;
    displayTextAttribute: PluginWidget.EditableValue<string>;
    displayTextStatic: PluginWidget.DynamicValue<string>;
    maximumValueAttribute: PluginWidget.EditableValue<number>;
    negativeValueColor: BootstrapStyle;
    progressAttribute: PluginWidget.EditableValue<number>;
    positiveValueColor: BootstrapStyle;
    textSize: ProgressTextSize;
    staticValue: PluginWidget.DynamicValue<number>;
    staticMaximumValue: PluginWidget.DynamicValue<number>;
    onClickAction: PluginWidget.ActionValue;
}

type Handler = () => void;

export type DisplayText = "none" | "value" | "percentage" | "static" | "attribute";

export default class ProgressCircleContainer extends Component<ContainerProps> {
    private readonly clickHandler: Handler = this.handleOnClick.bind(this);

    private defaultMaximumValue = 100;

    render() {
        const maximumValue = this.props.maximumValueAttribute !== undefined
            ? this.props.maximumValueAttribute.value
            : (this.props.staticMaximumValue && this.props.staticMaximumValue.value)
                ? this.props.staticMaximumValue.value
                : this.defaultMaximumValue;

        return createElement(ProgressCircle, {
            animate: this.hasAnimation(),
            circleThickness: this.props.circleThickness.value,
            className: this.props.class,
            clickable: !!this.props.onClickAction,
            displayText: this.props.displayText,
            displayTextValue: this.getDisplayTextValue(),
            maximumValue,
            negativeValueColor: this.props.negativeValueColor,
            onClickAction: this.clickHandler,
            positiveValueColor: this.props.positiveValueColor,
            style: this.props.style,
            textSize: this.props.textSize,
            value: this.props.progressAttribute ? this.props.progressAttribute.value || 0 : this.props.staticValue.value
        });
    }

    private hasAnimation() {
        // IE 11 does not support animation when line svg line size large then 7
        // https://github.com/kimmobrunfeldt/progressbar.js/issues/79
        const isIe11 = !!(window as any).MSInputMethodContext && !!(document as any).documentMode;
        const isEdge = window.navigator.userAgent.indexOf("Edge/") > 0;
        if ((isIe11 || isEdge) && this.props.circleThickness.value as number >= 7 && this.props.animate) {
            logger.warn("Disabled animation on IE and Edge");
            return false;
        }
        return this.props.animate.value as boolean;
    }

    private getDisplayTextValue() {
        if (this.props.displayText === "attribute") {
            return this.props.displayTextAttribute ? this.props.displayTextAttribute.value : "";
        } else if (this.props.displayText === "static") {
            return this.props.displayTextStatic.value;
        }

        return "";
    }

    private handleOnClick() {
        if (this.props.onClickAction) {
            this.props.onClickAction.execute();
        }
    }
}

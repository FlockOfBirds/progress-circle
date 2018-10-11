import { Component, createElement } from "react";
import { ProgressCircle, ProgressCircleProps } from "./components/ProgressCircle";
import { ContainerProps } from "./components/ProgressCircleContainer";

declare function require(name: string): string;

type VisibilityMap = {
    [ P in keyof ContainerProps ]: boolean;
};

// tslint:disable-next-line:class-name
export class preview extends Component<ContainerProps, {}> {
    render() {
        return createElement(ProgressCircle, this.transformProps(this.props));
    }

    private transformProps(props: ContainerProps): ProgressCircleProps {
        return {
            circleThickness: props.circleThickness.value,
            className: props.class,
            clickable: false,
            displayText: props.displayText,
            displayTextValue: this.getDisplayTextValue() as string,
            maximumValue: props.staticMaximumValue.value,
            positiveValueColor: props.positiveValueColor,
            style: this.props.style,
            textSize: props.textSize,
            value: props.staticValue.value
        };
    }

    private getDisplayTextValue() {
        if (this.props.displayText === "attribute") {
            return `{ ${this.props.displayTextAttribute.value} }`;
        } else if (this.props.displayText === "static") {
            return this.props.displayTextStatic.value;
        }

        return "";
    }
}

export function getPreviewCss() {
    return require("./ui/ProgressCircle.scss");
}

export function getVisibleProperties(valueMap: ContainerProps, visibilityMap: VisibilityMap) {
    // visibilityMap.microflow = valueMap.onClickEvent === "callMicroflow";
    // visibilityMap.nanoflow = valueMap.onClickEvent === "callNanoflow";
    // visibilityMap.page = valueMap.onClickEvent === "showPage";
    // visibilityMap.openPageAs = valueMap.onClickEvent === "showPage";
    visibilityMap.displayTextAttribute = valueMap.displayText === "attribute";
    visibilityMap.displayTextStatic = valueMap.displayText === "static";

    return visibilityMap;
}

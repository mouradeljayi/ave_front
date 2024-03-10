import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit, AfterViewInit {

    @ViewChild('rangeOne') rangeOne: ElementRef
    @ViewChild('rangeTwo') rangeTwo: ElementRef
    @ViewChild('rangeThree') rangeThree: ElementRef
    @ViewChild('rangeFour') rangeFour: ElementRef
    @ViewChild('incl01') incl01: ElementRef;
    @ViewChild('incl12') incl12: ElementRef;
    @ViewChild('incl23') incl23: ElementRef;
    @ViewChild('incl34') incl34: ElementRef;
    @ViewChild('incl45') incl45: ElementRef;
    @ViewChild('outputOne') outputOne: ElementRef;
    @ViewChild('outputTwo') outputTwo: ElementRef;
    @ViewChild('outputThree') outputThree: ElementRef;
    @ViewChild('outputFour') outputFour: ElementRef;

    @Input() disabled : boolean = false

    thresholders: any[] = [
        {
            "id": 1050,
            "mesure_id": {
                "id": 1,
                "name": "Last length",
                "key": "lastLength"
            },
            "min": -3,
            "value1": -2,
            "value2": -1,
            "value3": 1,
            "value4": 2,
            "max": 3
        },
    ]

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        
        this.thresholders.forEach(thresholder => {
            this.rangeOne.nativeElement.value = thresholder.value1;
            this.rangeTwo.nativeElement.value = thresholder.value2;
            this.rangeThree.nativeElement.value = thresholder.value3;
            this.rangeFour.nativeElement.value = thresholder.value4;
            this.mouseUp(thresholder);
        });
        
    }

    mouseUp(thresholder: any) {

        let max = thresholder.max - thresholder.min;
        let min = 0;
        if (Number(this.rangeOne.nativeElement.value) > thresholder.value2) {
            this.rangeOne.nativeElement.value = thresholder.value1;
        }
        else {
            thresholder.value1 = Number(this.rangeOne.nativeElement.value);
        }
        if (Number(this.rangeTwo.nativeElement.value) > thresholder.value3 || thresholder.value1 > Number(this.rangeTwo.nativeElement.value)) {
            this.rangeTwo.nativeElement.value = thresholder.value2;
        }
        else {
            thresholder.value2 = Number(this.rangeTwo.nativeElement.value);
        }
        if (Number(this.rangeThree.nativeElement.value) > thresholder.value4 || thresholder.value2 > Number(this.rangeThree.nativeElement.value)) {
            this.rangeThree.nativeElement.value = thresholder.value3;
        }
        else {
            thresholder.value3 = Number(this.rangeThree.nativeElement.value);
        }
        if (thresholder.value3 > Number(this.rangeFour.nativeElement.value)) {
            this.rangeFour.nativeElement.value = thresholder.value4;
        }
        else {
            thresholder.value4 = Number(this.rangeFour.nativeElement.value);
        }
        let valueRangeOne = Number(this.rangeOne.nativeElement.value) - thresholder.min;
        let valueRangeTwo = Number(this.rangeTwo.nativeElement.value) - thresholder.min;
        let valueRangeThree = Number(this.rangeThree.nativeElement.value) - thresholder.min;
        let valueRangeFour = Number(this.rangeFour.nativeElement.value) - thresholder.min;

        if (valueRangeOne > min) {
            this.incl01.nativeElement.width = ((valueRangeOne)) / max * 100 + '%';
            this.incl01.nativeElement.style.left = (min / max) * 100 + '%';
        } else {
            this.incl01.nativeElement.style.width = ((min - valueRangeOne)) / max * 100 + '%';
            this.incl01.nativeElement.style.left = (valueRangeOne / max) * 100 + '%';
        }
        if (valueRangeOne > valueRangeTwo) {
            this.incl12.nativeElement.style.width = ((valueRangeOne - valueRangeTwo)) / max * 100 + '%';
            this.incl12.nativeElement.style.left = (valueRangeTwo / max) * 100 + '%';
        } else {
            this.incl12.nativeElement.style.width = ((valueRangeTwo - valueRangeOne)) / max * 100 + '%';
            this.incl12.nativeElement.style.left = (valueRangeOne / max) * 100 + '%';
        }
        if (valueRangeTwo > valueRangeThree) {
            this.incl23.nativeElement.style.width = ((valueRangeTwo - valueRangeThree)) / max * 100 + '%';
            this.incl23.nativeElement.style.left = (valueRangeThree / max) * 100 + '%';
        } else {
            this.incl23.nativeElement.style.width = ((valueRangeThree - valueRangeTwo)) / max * 100 + '%';
            this.incl23.nativeElement.style.left = (valueRangeTwo / max) * 100 + '%';
        }
        if (valueRangeThree > valueRangeFour) {
            this.incl34.nativeElement.style.width = ((valueRangeThree - valueRangeFour)) / max * 100 + '%';
            this.incl34.nativeElement.style.left = (valueRangeFour / max) * 100 + '%';
        } else {
            this.incl34.nativeElement.style.width = ((valueRangeFour - valueRangeThree)) / max * 100 + '%';
            this.incl34.nativeElement.style.left = (valueRangeThree / max) * 100 + '%';
        }
        if (valueRangeFour > max) {
            this.incl45.nativeElement.style.width = ((valueRangeFour - max)) / max * 100 + '%';
            this.incl45.nativeElement.style.left = (100 / max) * 100 + '%';
        } else {
            this.incl45.nativeElement.style.width = ((max - valueRangeFour)) / max * 100 + '%';
            this.incl45.nativeElement.style.left = (valueRangeFour / max) * 100 + '%';
        }
        this.outputOne.nativeElement.innerHTML = this.rangeOne.nativeElement.value;
        this.outputOne.nativeElement.style.left = valueRangeOne / max * 100 + '%';
        this.outputTwo.nativeElement.innerHTML = this.rangeTwo.nativeElement.value;
        this.outputTwo.nativeElement.style.left = valueRangeTwo / max * 100 + '%';
        this.outputThree.nativeElement.innerHTML = this.rangeThree.nativeElement.value;
        this.outputThree.nativeElement.style.left = valueRangeThree / max * 100 + '%';
        this.outputFour.nativeElement.innerHTML = this.rangeFour.nativeElement.value;
        this.outputFour.nativeElement.style.left = valueRangeFour / max * 100 + '%';
    }


}
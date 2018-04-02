export default class LengthValidator{
    constructor(){
        this.require='ngModel';
    }
    link(scope, element, attr, mCtrl) {
        function lengthValidation(value) {
            if (value.length > 5) {
                mCtrl.$setValidity('nameLength', true);
                console.log(true);
            } else {
                mCtrl.$setValidity('nameLength', false);
                console.log(false);
            }
            return value;
        }
        mCtrl.$parsers.push(lengthValidation);
    }
}
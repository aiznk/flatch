import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'

export class LabelInput extends nue.Div {
	constructor ({ labelText, inputPlaceholder='' }={}, attrs={}) {
		if (attrs.class) {
			attrs.class += ' label-input'
		} else {
			attrs.class = 'label-input'
		}
		super(attrs)

		this.label = new nue.Label(labelText)
		this.add(this.label)

		this.input = new nue.Input({ placeholder: inputPlaceholder })
		this.add(this.input)
	}

	setValue (value) {
		this.input.setValue(value)
	}

	getValue () {
		return this.input.getValue()
	}
}
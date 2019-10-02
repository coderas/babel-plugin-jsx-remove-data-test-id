const getAttributeIdentifiers = options => {
	if (!options || typeof (options.attributes) === "undefined") return [
		"data-test-id",
		"data-testid"
	]

	if (Array.isArray(options.attributes)) {
		if (options.attributes.length === 0) {
			throw new Error("option attributes must be an array with at least one element")
		}

		if (options.attributes.length !== options.attributes.filter(attr => attr && typeof (attr) === "string").length) {
			throw new Error("all items in the option attributes must be non empty strings")
		}

		return options.attributes
	}

	if (!options.attributes || typeof (options.attributes) !== "string") {
		throw new Error("option attributes must be a non empty string or an array with non empty strings")
	}

	return [ options.attributes ]
}

const isDefined = value => typeof value !== "undefined"


const RemoveDataTestIds = ({ types: t }) => {
	const visitor = {
		JSXOpeningElement: (path, state) => {
			if (path.node.hasStripped) {
				return
			}
			const attributeIdentifiers = getAttributeIdentifiers(state.opts)

			const attrs =
				path
					.node
					.attributes
					.map((attribute) => {

						const properties = attribute.value.expression.properties.filter(property => {
							return attributeIdentifiers.includes(property.key.value)
						})
						if (properties.length === 0) {
							return {
								...attribute,
								properties,
							}
						}
						return undefined
					})
					.filter(isDefined)

			const node = t.jSXOpeningElement(
				path.node.name,
				attrs,
				path.node.selfClosing
			)
			node.hasStripped = true
			path.replaceWith(node)
		}
	}

	return {
		visitor
	}
}

export default RemoveDataTestIds

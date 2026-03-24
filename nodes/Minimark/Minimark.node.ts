import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { textContent } from 'minimark'; 
import { stringify } from 'minimark/stringify';
import type { MinimarkTree, MinimarkNode } from 'minimark';

export class Minimark implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Minimark Utilities',
		name: 'minimark',
		icon: 'file:minimark.svg',
		group: ['transform'],
		version: 1,
		description: 'Utilities for Minimark AST',
		defaults: {
			name: 'Minimark Utilities',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Stringify',
						value: 'stringify',
						description: 'Convert Minimark AST to markdown',
						action: 'Convert AST to markdown',
					},
					{
						name: 'Get Text Content',
						value: 'textContent',
						description: 'Extract plain text from Minimark AST',
						action: 'Extract text from AST',
					},
				],
				default: 'stringify',
			},
			{
				displayName: 'AST',
				name: 'ast',
				type: 'json',
				default: '',
				required: true,
				description: 'The Minimark AST to process (JSON array or object)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				let ast = this.getNodeParameter('ast', i) as MinimarkTree | MinimarkNode[];

				if (typeof ast === 'string') {
					try {
						ast = JSON.parse(ast);
					} catch {
						throw new NodeOperationError(this.getNode(), 'Invalid JSON for AST', { itemIndex: i });
					}
				}

				// Wrap in MinimarkTree if it's just the nodes array
				const tree: MinimarkTree = Array.isArray(ast) ? { type: 'minimark', value: ast } : ast;

				if (operation === 'stringify') {
					const result = stringify(tree);
					returnData.push({
						json: {
							markdown: result,
						},
						pairedItem: i,
					});
				} else if (operation === 'textContent') {
					// textContent expects MinimarkNode which can be string or [string, Record, ...nodes]
					// We can join text content of all top level nodes
					const result = tree.value.map((node: MinimarkNode) => textContent(node)).join(' ');
					returnData.push({
						json: {
							text: result,
						},
						pairedItem: i,
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: i,
					});
				} else {
					throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
				}
			}
		}

		return [returnData];
	}
}

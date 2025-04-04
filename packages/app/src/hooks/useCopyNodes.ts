import { type NodeId } from '@ironclad/rivet-core';
import { useAtomValue, useSetAtom } from 'jotai';
import { selectedNodesState } from '../state/graphBuilder';
import { connectionsState, nodesByIdState } from '../state/graph';
import { clipboardState } from '../state/clipboard';
import { isNotNull } from '../utils/genericUtilFunctions';

export function useCopyNodes() {
  const selectedNodeIds = useAtomValue(selectedNodesState);
  const nodesById = useAtomValue(nodesByIdState);
  const connections = useAtomValue(connectionsState);
  const setClipboard = useSetAtom(clipboardState);

  return (additionalNodeId?: NodeId) => {
    const nodeIds = (
      selectedNodeIds.length > 0 ? [...new Set([...selectedNodeIds, additionalNodeId])] : [additionalNodeId]
    ).filter(isNotNull);

    const copiedConnections = connections.filter(
      (c) => nodeIds.includes(c.inputNodeId) && nodeIds.includes(c.outputNodeId),
    );

    setClipboard({
      type: 'nodes',
      nodes: nodeIds.map((id) => nodesById[id]).filter(isNotNull),
      connections: copiedConnections,
    });
  };
}

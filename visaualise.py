import networkx as nx
import matplotlib.pyplot as plt

def visualize_cayley_graph(group, generators):
    """
    Visualize the Cayley graph of a group given its generators.

    Parameters:
    - group: List or set representing the group elements.
    - generators: List of generators for the group.

    Returns:
    - A NetworkX graph representing the Cayley graph.
    """
    # Create a directed graph
    cayley_graph = nx.DiGraph()

    # Add group elements as nodes
    cayley_graph.add_nodes_from(group)

    # Add edges based on group actions with generators
    for element in group:
        for generator in generators:
            product = element * generator  # Group action
            cayley_graph.add_edge(element, product)

    return cayley_graph

def plot_cayley_graph(cayley_graph):
    """
    Plot the Cayley graph using Matplotlib.

    Parameters:
    - cayley_graph: NetworkX graph representing the Cayley graph.
    """
    pos = nx.spring_layout(cayley_graph)  # Layout for better visualization
    labels = {node: str(node) for node in cayley_graph.nodes()}

    nx.draw(cayley_graph, pos, with_labels=True, labels=labels,
            node_size=700, node_color="skyblue", font_size=8, font_color="black", font_weight="bold", arrowsize=10)

    plt.title("Cayley Graph Visualization")
    plt.show()

# Example usage
group_elements = set(range(1, 6))  # Replace with your group elements
group_generators = {2, 4}  # Replace with your group generators

cayley_graph = visualize_cayley_graph(group_elements, group_generators)
plot_cayley_graph(cayley_graph)

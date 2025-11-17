import { createSystem, defaultConfig } from '@chakra-ui/react';

// Chakra v3 uses createSystem instead of extendTheme
// Using defaultConfig for now to ensure it works, can customize later
const system = createSystem(defaultConfig);

export default system;



import { motion } from 'framer-motion';
import React from 'react';

export default function CommonBodyAnimation({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            viewport={{ once: true }}
            initial={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.95, delay: 0.4, type: 'linear' }}
            whileInView={{ y: 0, opacity: 1 }}
        >
            {children}
        </motion.div>
    );
}

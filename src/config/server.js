import express from 'express';

const server = express();

// Routes
import IndexRoute from '../routes/index.routes';
import SectorsRoutes from '../routes/sectors.routes';
import CategoriesRoutes from '../routes/categories.routes';
import ProductsRoutes from '../routes/products.routes';
import UsersRoutes from '../routes/users.routes';
import TypesUsersRoutes from '../routes/typesUsers.routes';
import PeriodsRoutes from '../routes/periods.routes';
import PublicationsRoutes from '../routes/publications.routes';

// Settings
server.set('port', process.env.PORT || 4001);

// Middleware
server.use(express.json());

// Routes
server.use(IndexRoute);
server.use('/sectors', SectorsRoutes);
server.use('/categories', CategoriesRoutes);
server.use('/products', ProductsRoutes);
server.use('/users', UsersRoutes);
server.use('/types-users', TypesUsersRoutes);
server.use('/periods', PeriodsRoutes);
server.use('/publications', PublicationsRoutes);



export default server;